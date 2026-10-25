import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BuildingRedirect } from '@/entities/building';
import { selectPointPresentation } from '@/entities/point';
import { selectFromPoint, selectToPoint } from '@/entities/route';
import { SideBarContent, selectPanelExpanded, setMainContent } from '@/entities/sidebar';
import { FloorSwitcher } from '@/features/select-floor';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import type { IBuilding } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { MapSkeleton } from '@/shared/ui';
import { FloorMap } from '@/widgets/floor-map';
import { useInstituteBuilding } from '../model/useInstituteBuilding';
import { useFloorSwitcherFit } from '../model/useFloorSwitcherFit';

function MapOverlay({ building }: { building: IBuilding }) {
    const floorFit = useFloorSwitcherFit();
    const start = useAppSelector(selectFromPoint)
    const end = useAppSelector(selectToPoint)
    const panelExpanded = useAppSelector(selectPanelExpanded)
    const { pointId, detailsCollapsed } = useAppSelector(selectPointPresentation);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const controlsHidden = isPhone && pointId ? !detailsCollapsed : panelExpanded;
    const primaryBuildingId = start?.buildingId ?? end?.buildingId ?? building.id
    const showSecond = Boolean(start && end && start.buildingId !== end.buildingId)

    return (
        <>
            <div className={`map-panel-controls ${controlsHidden ? 'is-hidden' : ''}`}
                aria-hidden={controlsHidden} inert={controlsHidden}>
                <div ref={floorFit.ref}
                    className={`floor-switcher-position ${pointId ? 'is-room-attached' : ''} ${floorFit.hidden ? 'is-overflowing' : ''}`}
                    aria-hidden={floorFit.hidden} inert={floorFit.hidden}>
                    <FloorSwitcher buildingId={building.id} floors={building.floors} />
                </div>
                {showSecond && start && end && <div className="pointer-events-none absolute right-2 bottom-[calc(var(--mobile-drawer-offset)+60px)] left-2 z-20 flex justify-center desktop:left-(--panel-width) desktop:bottom-2">
                    <div data-map-interaction className="pointer-events-auto flex w-full gap-1 rounded-xl border bg-secondary shadow-subtle desktop:w-[min(370px,calc(100%-24px))]">
                        <BuildingRedirect buildingId={primaryBuildingId} currentBuildingId={building.id} />
                        {showSecond && end &&
                        <BuildingRedirect buildingId={end.buildingId} currentBuildingId={building.id} />
                        }
                    </div>
                </div>}
            </div>
        </>
    )
}

export default function InstitutePage() {
    const dispatch = useAppDispatch()
    const { t } = useTranslation();
    const params = useParams<{ intstName: string }>();
    const { building, isLoading, error, mapGps, userGps } = useInstituteBuilding(params.intstName ?? '')

    useEffect(() => {
        dispatch(setMainContent(SideBarContent.Empty))
    }, [dispatch])

    const headerName = building?.displayableName

    return (
        <div className="relative size-full overflow-hidden">
            <Helmet>
                <title>
                    {headerName ? t('InstitutePageTitle', { name: headerName }) : t('LoadingPageTitle')}
                </title>
                <meta
                    name="description"
                    content={headerName
                        ? t('InstitutePageDescription', { name: headerName })
                        : t('LoadingPageDescription')}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            {isLoading && <MapSkeleton label={t('Loading')} />}
            {!isLoading && !headerName &&
                <div className="flex size-full items-center justify-center p-10 text-muted-foreground">
                    {error ?? t('LoadingPageTitle')}
                </div>
            }

            {!isLoading && building &&
                <>
                    <div data-map-interaction className="absolute inset-0 bg-white dark:bg-background">
                        <FloorMap building={building} userGps={userGps} mapGps={mapGps} />
                    </div>
                    <MapOverlay building={building} />
                </>
            }
        </div>
    )
}
