import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { BuildingRedirect } from '@/entities/building';
import { selectSelectedPointId } from '@/entities/point';
import { selectFromPoint, selectToPoint } from '@/entities/route';
import { SideBarContent, setContent } from '@/entities/sidebar';
import { FloorSwitcher } from '@/features/select-floor';
import { GpsToggle } from '@/features/user-location';
import type { IBuilding } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { FloorMap } from '@/widgets/floor-map';
import { PointDetails } from '@/widgets/point-details';
import { SideMenu } from '@/widgets/side-menu';
import { useInstituteBuilding } from '../model/useInstituteBuilding';

function MapOverlay({ building }: { building: IBuilding }) {
    const start = useAppSelector(selectFromPoint)
    const end = useAppSelector(selectToPoint)
    const pointId = useAppSelector(selectSelectedPointId)
    const primaryBuildingId = start?.buildingId ?? end?.buildingId ?? building.id
    const showSecond = Boolean(start && end && start.buildingId !== end.buildingId)

    return (
        <>
            <SideMenu />
            {pointId && <PointDetails pointId={pointId} />}
            <div className="absolute top-[92px] right-2 z-20 max-h-[calc(100%-180px)] overflow-y-auto [scrollbar-width:none] desktop:top-6 desktop:right-3">
                <FloorSwitcher buildingId={building.id} floors={building.floors} />
            </div>
            <div className="pointer-events-none absolute right-2 bottom-2 left-2 z-20 flex justify-center desktop:left-(--panel-width)">
                <div className="pointer-events-auto flex w-full gap-1 rounded-xl border bg-secondary shadow-subtle desktop:w-[min(370px,calc(100%-24px))]">
                    <BuildingRedirect buildingId={primaryBuildingId} currentBuildingId={building.id} />
                    {showSecond && end &&
                        <BuildingRedirect buildingId={end.buildingId} currentBuildingId={building.id} />
                    }
                </div>
            </div>
            <div className="absolute right-2 bottom-[calc(8px+var(--mobile-drawer-offset)+var(--keyboard-offset))] z-20 transition-[bottom] duration-200 desktop:right-3 desktop:bottom-2">
                <GpsToggle />
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
        dispatch(setContent(SideBarContent.Empty))
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

            {!headerName &&
                <div className="flex size-full items-center justify-center p-10 text-muted-foreground">
                    {isLoading ? t('Loading') : (error ?? t('LoadingPageTitle'))}
                </div>
            }

            {!isLoading && building &&
                <>
                    <div className="absolute inset-0">
                        <FloorMap building={building} userGps={userGps} mapGps={mapGps} />
                    </div>
                    <MapOverlay building={building} />
                </>
            }
        </div>
    )
}
