import { useEffect, useRef } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { selectCampusOpen, setCampusOpen } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function CampusOverlay() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectCampusOpen);
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
            <Dialog.Content className="navigator-panel is-settings is-expanded settings-overlay" aria-describedby={undefined}
                onOpenAutoFocus={() => { opener.current = document.activeElement as HTMLElement | null; }}
                onCloseAutoFocus={event => {
                    event.preventDefault();
                    if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
                }}>
                <div className="navigator-header">
                    <div className="navigator-search-row">
                        <Dialog.Title className="navigator-heading">{t('SelectCampus')}</Dialog.Title>
                        <Dialog.Close asChild><Button variant="secondary" size="icon-lg" aria-label={t('Close')}>
                            <img src="/remake/f17f3.svg" alt="" width="20" height="20" />
                        </Button></Dialog.Close>
                    </div>
                </div>
                <div className="navigator-body" />
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>;
}
