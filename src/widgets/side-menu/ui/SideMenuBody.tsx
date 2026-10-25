import { lazy } from 'react';
import { SideBarContent } from '@/entities/sidebar';
import { QuickTypes, SearchResults, SearchHistory } from '@/features/point-search';
import { InstitutesList } from './InstitutesList';
const RoutePanel = lazy(() => import('./RoutePanel').then(module => ({ default: module.RoutePanel })));

export function SideMenuBody({ content, campusProgress = 0 }: { content: SideBarContent, campusProgress?: number }) {
    switch (content) {
    case SideBarContent.Institutes:
    case SideBarContent.ExpandedInstitutes:
        return <InstitutesList progress={campusProgress} />;
    case SideBarContent.PointsList:
        return <SearchResults />;
    case SideBarContent.Route:
        return <RoutePanel />;
    case SideBarContent.TypeList:
        return <><QuickTypes /><SearchHistory /></>;
    case SideBarContent.Categories:
    case SideBarContent.Empty:
        return <QuickTypes />;
    }
}
