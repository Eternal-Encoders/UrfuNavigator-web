import { Suspense, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from '@/pages/home';
import { InstitutePage } from '@/pages/institute';
import { setPageReady } from '@/entities/viewer';
import { useAppDispatch } from '@/shared/lib';
import { MapSkeleton } from '@/shared/ui';
import { SideMenu, SettingsOverlay, CampusOverlay } from '@/widgets/side-menu';
import { usePanelBack } from '../model/usePanelBack';
import { usePagePreload } from '../model/usePagePreload';

function NavigatorLayout() {
    const { t } = useTranslation();
    usePagePreload();
    usePanelBack();
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    useLayoutEffect(() => { dispatch(setPageReady(false)); }, [dispatch, pathname]);
    return <div className="relative size-full overflow-hidden">
        <Suspense fallback={<MapSkeleton label={t('Loading')} />}>
            <Outlet />
        </Suspense>
        <SideMenu />
        <SettingsOverlay />
        <CampusOverlay />
    </div>;
}

export function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route element={<NavigatorLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/institute/:intstName" element={<InstitutePage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Route>
        </Routes>
    </BrowserRouter>;
}
