import { Suspense } from 'react';
import { useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectPointPresentation } from '@/entities/point';
import { SideBarContent, setContent, setCampusOpen, selectPanelState } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { GpsToggle } from '@/features/user-location';
import { compassIcon, horizontalLineIcon, reloadIcon } from '@/shared/assets/icons/common';
import { ListSkeleton } from '@/shared/ui';
import { useSideMenu } from '../model/useSideMenu';
import { SideMenuBody } from './SideMenuBody';
import { SideMenuHeader } from './SideMenuHeader';

export function SideMenu() {
    const {
        content, isPhone, position, panelRef, isDragging, panelHeight, campusProgress, isCampus,
        isBuildingsDrawer, searchOnlyHeight, toggleDrawer
    } = useSideMenu();
    const { routeDocked, routeOpen } = useAppSelector(selectPanelState);
    const hasFocusedRoom = Boolean(useAppSelector(selectPointPresentation).pointId);
    const covered = hasFocusedRoom || routeOpen;
    const intstName = useMatch('/institute/:intstName')?.params.intstName;
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const expanded = [
        SideBarContent.ExpandedInstitutes, SideBarContent.TypeList, SideBarContent.Categories,
        SideBarContent.PointsList,
        SideBarContent.Route
    ].includes(content);
    const isCollapsed = isPhone && position <= searchOnlyHeight;
    const floorClass = content === SideBarContent.Empty ? 'is-floor' : '';
    return (
        <aside ref={panelRef} className={`navigator-panel main-navigator-panel ${routeDocked ? 'is-route-panel' : ''} ${covered ? 'is-room-covered' : ''} ${floorClass} ${expanded ? 'is-expanded' : ''} ${isDragging ? 'is-dragging' : ''} ${isCampus ? 'is-campus' : ''}`}
            aria-label={t('SearchForAudiencesAndPlaces')} aria-hidden={covered} inert={covered}
            style={{ height: isPhone ? panelHeight : undefined }}>
            {!expanded && !routeDocked && <div className="navigator-actions" style={isCampus ? {
                opacity: Math.max(0, 1 - campusProgress * 4),
                transform: `translateY(${-12 * campusProgress}px)`,
                pointerEvents: campusProgress > 0.1 ? 'none' : undefined
            } : undefined}>
                {!intstName && <button type="button" onClick={() => dispatch(setCampusOpen(true))}>
                    <img src={reloadIcon} alt="" width="20" height="20" />{t('Campus')}
                </button>}
                {intstName && <div data-map-interaction><GpsToggle /></div>}
                <button type="button" onClick={() => dispatch(setContent(SideBarContent.Route))}>
                    <img src={compassIcon} alt="" width="20" height="20" />{t('Route')}
                </button>
            </div>}
            <div className="navigator-header">
                {isPhone && <div className="navigator-handle">
                    <button type="button" aria-label={t('TogglePanel')} aria-expanded={expanded && !isCollapsed} onClick={toggleDrawer}>
                        {isCampus && <img src={horizontalLineIcon} width="24" height="4" alt="" />}
                    </button>
                </div>}
                <div className="navigator-search-row"><SideMenuHeader compactRoute={isCollapsed} campusProgress={isCampus && !routeDocked ? campusProgress : undefined} content={isCollapsed && !routeDocked ? (intstName ? SideBarContent.Empty : SideBarContent.Institutes) : content} /></div>
            </div>
            <div className="navigator-body" style={isPhone ? {
                display: isCollapsed ? 'none' : undefined,
                opacity: isCampus
                    ? Math.min(1, Math.max(0, (position - searchOnlyHeight) / (244 - searchOnlyHeight))) : undefined,
                paddingBlock: Math.min(16, Math.max(0, (position - searchOnlyHeight) / 2)),
                overflowX: 'hidden',
                overflowY: isCampus && campusProgress < 0.999 ? 'hidden' : isBuildingsDrawer ? 'hidden' : undefined
            } : undefined}><Suspense fallback={<ListSkeleton label={t('Loading')} />}><SideMenuBody content={content} campusProgress={campusProgress} /></Suspense></div>
        </aside>
    );
}
