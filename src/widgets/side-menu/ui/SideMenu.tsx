import { Suspense } from 'react';
import { useNavigate, useMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SideBarContent, setContent } from '@/entities/sidebar';
import { useAppDispatch } from '@/shared/lib';
import { GpsToggle } from '@/features/user-location';
import { ListSkeleton } from '@/shared/ui';
import { useSideMenu } from '../model/useSideMenu';
import { SideMenuBody } from './SideMenuBody';
import { SideMenuHeader } from './SideMenuHeader';

export function SideMenu() {
    const {
        content, isPhone, position, panelRef, isDragging, panelHeight, campusProgress, isCampus,
        isBuildingsDrawer, searchOnlyHeight, toggleDrawer
    } = useSideMenu();
    const intstName = useMatch('/institute/:intstName')?.params.intstName;
    const navigate = useNavigate();
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
        <aside ref={panelRef} className={`navigator-panel ${floorClass} ${expanded ? 'is-expanded' : ''} ${isDragging ? 'is-dragging' : ''} ${isCampus ? 'is-campus' : ''}`}
            aria-label={t('SearchForAudiencesAndPlaces')} style={isPhone ? { height: panelHeight } : undefined}>
            {!expanded && <div className="navigator-actions" style={isCampus ? {
                opacity: Math.max(0, 1 - campusProgress * 4),
                transform: `translateY(${-12 * campusProgress}px)`,
                pointerEvents: campusProgress > 0.1 ? 'none' : undefined
            } : undefined}>
                {!intstName && <button type="button" onClick={() => { navigate('/'); dispatch(setContent(SideBarContent.Institutes)); }}>
                    <img src="/remake/ef628.svg" alt="" width="20" height="20" />{t('Campus')}
                </button>}
                {intstName && <div data-map-interaction><GpsToggle /></div>}
                <button type="button" onClick={() => dispatch(setContent(SideBarContent.Route))}>
                    <img src="/remake/80d8f.svg" alt="" width="20" height="20" />{t('Route')}
                </button>
            </div>}
            <div className="navigator-header">
                {isPhone && <div className="navigator-handle">
                    <button type="button" aria-label={t('TogglePanel')} aria-expanded={expanded} onClick={toggleDrawer}>
                        {isCampus && <img src="/remake/3a06c.svg" width="24" height="4" alt="" />}
                    </button>
                </div>}
                <div className="navigator-search-row"><SideMenuHeader campusProgress={isCampus ? campusProgress : undefined} content={isCollapsed ? (intstName ? SideBarContent.Empty : SideBarContent.Institutes) : content} /></div>
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
