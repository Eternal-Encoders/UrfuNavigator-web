import { lazy, Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectPageReady, selectScreenSize } from '@/entities/viewer';
import { selectSettingsOpen, setSettingsOpen } from '@/entities/sidebar';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { closeIcon } from '@/shared/assets/icons/common';
import { Button, ListSkeleton } from '@/shared/ui';

const loadOverlay = () => import('./SettingsOverlay').then(module => ({ default: module.SettingsOverlay }));
const Overlay = lazy(loadOverlay);

export function SettingsLayer() {
    const open = useAppSelector(selectSettingsOpen);
    const isDesktop = useAppSelector(selectScreenSize).innerWidth > PHONE_BREAKPOINT;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const [visited, setVisited] = useState(false);
    const pageReady = useAppSelector(selectPageReady);
    useEffect(() => {
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        if (!pageReady || open || visited || connection?.saveData) return;
        let cancelled = false;
        let idle: number | undefined;
        let timer: ReturnType<typeof setTimeout> | undefined;
        function preload() {
            void loadOverlay().then(() => { if (!cancelled) setVisited(true); }).catch(() => {
                // Opening settings still uses the normal lazy loader if background loading fails.
            });
        }
        function schedule() {
            if ('requestIdleCallback' in window) idle = window.requestIdleCallback(preload, { timeout: 2000 });
            else timer = setTimeout(preload, 300);
        }
        if (document.readyState === 'complete') schedule();
        else window.addEventListener('load', schedule, { once: true });
        return () => {
            cancelled = true;
            window.removeEventListener('load', schedule);
            if (idle !== undefined) window.cancelIdleCallback(idle);
            if (timer !== undefined) clearTimeout(timer);
        };
    }, [pageReady, open, visited]);
    useEffect(() => { if (open) setVisited(true); }, [open]);
    // Retain the loaded dialog after first use so its exit animation can complete.
    if (!open && !visited) return null;
    return <Suspense fallback={open ? <>
        <div className="settings-backdrop" onClick={() => { if (!isDesktop) dispatch(setSettingsOpen(false)); }} />
        <aside className="navigator-panel is-settings is-expanded settings-overlay">
            <div className="navigator-header flex items-end p-4">
                <Button variant="secondary" size="icon-lg" aria-label={t('Close')}
                    onClick={() => dispatch(setSettingsOpen(false))}>
                    <img src={closeIcon} width="20" height="20" alt="" />
                </Button>
            </div>
            <div className="navigator-body"><ListSkeleton label={t('Loading')} /></div>
        </aside>
    </> : null}><Overlay /></Suspense>;
}
