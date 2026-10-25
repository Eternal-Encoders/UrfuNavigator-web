import { useEffect, useRef, type CSSProperties } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { CAMPUSES, selectCampus, selectCampusState } from '@/entities/campus';
import { BuildingPhotoImage, useGetBuildingIconQuery, useGetBuildingsQuery } from '@/entities/building';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { selectCampusOpen, setCampusOpen } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector, useModalSwipe } from '@/shared/lib';
import { closeIcon, horizontalLineIcon } from '@/shared/assets/icons/common';
import { Button } from '@/shared/ui';

export function CampusOverlay() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectCampusOpen);
    const { selected } = useAppSelector(selectCampusState);
    const { data: buildings = [] } = useGetBuildingsQuery();
    const { data: ienimIcon } = useGetBuildingIconQuery('ienim.svg', { skip: !open });
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const { panelRef, offset, dragging } = useModalSwipe(open, isPhone, () => dispatch(setCampusOpen(false)));
    const { pathname } = useLocation();
    const previousPath = useRef(pathname);
    const opener = useRef<HTMLElement | null>(null);
    useEffect(() => {
        if (previousPath.current !== pathname) dispatch(setCampusOpen(false));
        previousPath.current = pathname;
    }, [dispatch, pathname]);
    return <Dialog.Root open={open} onOpenChange={value => dispatch(setCampusOpen(value))}>
        <Dialog.Portal>
            <Dialog.Overlay className="settings-backdrop" />
            <Dialog.Content ref={panelRef}
                className={`navigator-panel is-settings is-expanded settings-overlay ${dragging ? 'is-dragging' : ''}`}
                style={{ '--settings-drag': `${offset}px` } as CSSProperties} aria-describedby={undefined}
                onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement | null; }}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                }}>
                <div className="navigator-header">
                    <div className="navigator-handle">
                        <Dialog.Close asChild><button type="button" aria-label={t('Close')}>
                            <img src={horizontalLineIcon} width="24" height="4" alt="" />
                        </button></Dialog.Close>
                    </div>
                    <div className="navigator-search-row">
                        <Dialog.Title className="navigator-heading">{t('SelectCampus')}</Dialog.Title>
                        <Dialog.Close asChild><Button variant="secondary" size="icon-lg" aria-label={t('Close')}>
                            <img src={closeIcon} alt="" width="20" height="20" />
                        </Button></Dialog.Close>
                    </div>
                </div>
                <div className="navigator-body">
                    <ul className="campus-selection-list">
                        {CAMPUSES.map(campus => {
                            const building = buildings.find(item => item.url.replace(/^\/+/, '') === campus.building);
                            const icon = campus.building === 'ienim' ? ienimIcon?.url : building?.icon?.url;
                            return <li key={campus.id}>
                                <button type="button" className="building-card" disabled={!campus.available}
                                    aria-pressed={selected === campus.id} onClick={() => {
                                        dispatch(selectCampus(campus.id)); dispatch(setCampusOpen(false));
                                    }}>
                                    <div className="building-photo building-icon">
                                        {icon && <BuildingPhotoImage src={icon} alt="" eager />}
                                    </div>
                                    <div className="building-card-info">
                                        <span className="building-card-title">{t(campus.label)}</span>
                                        {!campus.available && <span className="campus-unavailable">{t('CampusUnavailable')}</span>}
                                    </div>
                                </button>
                            </li>;
                        })}
                    </ul>
                </div>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}
