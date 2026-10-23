import { skipToken } from '@reduxjs/toolkit/query';
import { Dialog } from 'radix-ui';
import { useRef, useLayoutEffect, type ReactNode, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { clearSelectedPoint, selectPointPresentation, setDetailsCollapsed, pointNameList, pointTitle, PointTranslation,
    useGetPointByIdQuery, weekRows } from '@/entities/point';
import { selectScreenSize } from '@/entities/viewer';
import { selectRouteOpen } from '@/entities/sidebar';
import { useSelectPoint, type SearchDirection } from '@/features/point-search';
import type { IGraphPoint } from '@/shared/api';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector, useModalSwipe } from '@/shared/lib';
import { Button, ListSkeleton } from '@/shared/ui';

function DetailsSection({ title, children }: { title: string, children: ReactNode }) {
    return <section className="point-details-section">
        <h2>{title}</h2><div className="point-details-value">{children}</div>
    </section>;
}

export function PointDetails({ pointId }: { pointId?: string }) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const selectAsRoutePoint = useSelectPoint();
    const { currentData, isFetching, isError, refetch } = useGetPointByIdQuery(pointId ?? skipToken);
    const lastData = useRef<IGraphPoint | undefined>(undefined);
    if (currentData) lastData.current = currentData;
    const data = currentData ?? (!pointId ? lastData.current : undefined);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const routeOpen = useAppSelector(selectRouteOpen);
    const opener = useRef<HTMLElement | null>(null);
    const close = () => dispatch(clearSelectedPoint());
    const { detailsCollapsed, previewEnabled } = useAppSelector(selectPointPresentation);
    const lastCollapsed = useRef(detailsCollapsed);
    if (pointId) lastCollapsed.current = detailsCollapsed;
    const collapsed = pointId ? detailsCollapsed : lastCollapsed.current;
    const { panelRef, offset, dragging } = useModalSwipe(Boolean(pointId), isPhone, close, pointId, previewEnabled ? {
        expanded: !collapsed,
        onExpand: () => dispatch(setDetailsCollapsed(false)),
        onCollapse: () => dispatch(setDetailsCollapsed(true))
    } : undefined);
    useLayoutEffect(() => {
        const style = document.documentElement.style;
        if (pointId && isPhone) style.setProperty('--room-panel-lift', `${-offset}px`);
        return () => { style.removeProperty('--room-panel-lift'); };
    }, [pointId, isPhone, offset]);
    const names = data ? pointNameList(data) : [];
    const schedule = weekRows(data?.time);
    function addToRoute(direction: SearchDirection) {
        if (!data) return;
        selectAsRoutePoint(data, direction);
        close();
    }
    return <Dialog.Root modal={false} open={Boolean(pointId)} onOpenChange={open => { if (!open) close(); }}>
        <Dialog.Portal>
            <Dialog.Content ref={panelRef} aria-describedby={undefined}
                className={`navigator-panel is-settings is-expanded settings-overlay point-details-overlay ${collapsed ? 'is-preview' : ''} ${dragging ? 'is-dragging' : ''}`}
                style={{ '--settings-drag': `${Math.max(0, offset)}px`,
                    '--point-preview-pull': `${-Math.min(0, offset)}px` } as CSSProperties}
                onEscapeKeyDown={event => { if (!isPhone) event.preventDefault(); }}
                onInteractOutside={event => {
                    const target = event.detail.originalEvent.target;
                    if (collapsed || !isPhone || (target instanceof Element && target.closest('[data-floor-switcher]'))) {
                        event.preventDefault();
                    }
                }}
                onOpenAutoFocus={() => {
                    opener.current = document.activeElement as HTMLElement | null;
                }}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    if (!routeOpen && opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                }}>
                <div className="navigator-header">
                    <div className="navigator-handle">
                        <button type="button" aria-label={t(previewEnabled ? 'TogglePanel' : 'Close')} aria-expanded={!collapsed}
                            onClick={() => {
                                if (previewEnabled) dispatch(setDetailsCollapsed(!collapsed));
                                else close();
                            }}>
                            <img src="/remake/3a06c.svg" width="24" height="4" alt="" />
                        </button>
                    </div>
                    <div className="navigator-search-row">
                        <Dialog.Title className="navigator-heading truncate">
                            {data ? pointTitle(data) || t('RoomDetails') : t('RoomDetails')}
                        </Dialog.Title>
                        <Dialog.Close asChild><Button variant="secondary" size="icon-lg" aria-label={t('Close')}>
                            <img src="/remake/f17f3.svg" width="20" height="20" alt="" />
                        </Button></Dialog.Close>
                    </div>
                </div>
                <div className="navigator-body point-details-body">
                    {!data && isFetching && <ListSkeleton label={t('Loading')} />}
                    {!data && !isFetching && pointId && <div className="navigator-message" role="alert">
                        <p>{t('PointLoadError')}</p>
                        <Button variant="secondary" onClick={() => { void refetch(); }}>{t('Retry')}</Button>
                    </div>}
                    {data && <>
                        <div className="point-details-actions">
                            <Button variant="secondary" onClick={() => addToRoute('from')}>{t('FromHere')}</Button>
                            <Button variant="secondary" onClick={() => addToRoute('to')}>{t('ToHere')}</Button>
                        </div>
                        {isError && <p role="status">{t('PointLoadError')}</p>}
                        {names.length > 1 && <DetailsSection title={t('OtherNames')}>
                            {names.slice(1).map(name => <p key={name}>{name}</p>)}
                        </DetailsSection>}
                        {data.description && <DetailsSection title={t('Description')}>{data.description}</DetailsSection>}
                        {data.info && <DetailsSection title={t('AdditionalInfo')}>{data.info}</DetailsSection>}
                        {data.types.length > 0 && <DetailsSection title={t('PointType')}>
                            {data.types.map(type => <p key={type}>{PointTranslation[type] ?? type}</p>)}
                        </DetailsSection>}
                        {schedule.length > 0 && <DetailsSection title={t('OpeningHours')}>
                            <dl className="point-details-schedule">{schedule.map(day => <div key={day.label}>
                                <dt>{day.label}</dt><dd>{day.text}</dd>
                            </div>)}</dl>
                        </DetailsSection>}
                    </>}
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}
