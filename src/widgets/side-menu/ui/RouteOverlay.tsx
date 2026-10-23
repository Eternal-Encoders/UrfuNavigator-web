import { useRef, type CSSProperties } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { selectPanelState, setRouteOpen, finishRouteSearch, SideBarContent } from '@/entities/sidebar';
import { selectRoutePoints, clearRoute } from '@/entities/route';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector, useModalSwipe } from '@/shared/lib';
import { Button } from '@/shared/ui';
import { RoutePanel } from './RoutePanel';
import { RouteHeader } from './RouteHeader';

export function RouteOverlay() {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { routeOpen: open, routeContent: content } = useAppSelector(selectPanelState);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const { from, to } = useAppSelector(selectRoutePoints);
    const close = () => { dispatch(clearRoute()); dispatch(setRouteOpen(false)); };
    const { panelRef, offset, dragging } = useModalSwipe(open, isPhone, close);
    const opener = useRef<HTMLElement | null>(null);
    const searching = content === SideBarContent.TypeList || content === SideBarContent.PointsList;
    const collapsed = !from && !to && !searching;
    return <Dialog.Root open={open} onOpenChange={value => { if (!value) close(); }}>
        <Dialog.Portal>
            <Dialog.Overlay className="settings-backdrop" />
            <Dialog.Content ref={panelRef} aria-describedby={undefined}
                className={`navigator-panel is-settings is-expanded settings-overlay route-editor-overlay ${collapsed ? 'is-empty-route' : ''} ${dragging ? 'is-dragging' : ''}`}
                style={{ '--settings-drag': `${offset}px` } as CSSProperties}
                onEscapeKeyDown={event => {
                    if (!isPhone || searching) event.preventDefault();
                    if (searching) dispatch(finishRouteSearch());
                }}
                onInteractOutside={event => { if (!isPhone) event.preventDefault(); }}
                onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement | null; }}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                }}>
                <div className="navigator-header">
                    <div className="navigator-handle"><Dialog.Close asChild>
                        <button type="button" aria-label={t('Close')}>
                            <img src="/remake/3a06c.svg" width="24" height="4" alt="" />
                        </button>
                    </Dialog.Close></div>
                    <Dialog.Title className="sr-only">{t('Route')}</Dialog.Title>
                    <RouteHeader />
                    {!isPhone && <Dialog.Close asChild><Button variant="secondary" size="icon-lg" aria-label={t('Close')}>
                        <img src="/remake/f17f3.svg" width="20" height="20" alt="" />
                    </Button></Dialog.Close>}
                </div>
                {!collapsed && <div className="navigator-body">
                    <RoutePanel />
                </div>}
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}
