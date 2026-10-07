import { FloorPlan } from '@eternal-encoders/konva-floor-plan';
import { selectFloor } from '@/entities/floor';
import { selectPoint } from '@/entities/point';
import { selectRoutePoints } from '@/entities/route';
import { selectScreenSize, selectTheme, Theme } from '@/entities/viewer';
import type { IBuilding, IBuildingGps } from '@/shared/api';
import { boundGpsToMap, useAppDispatch, useAppSelector, type UserGPS } from '@/shared/lib';
import { desktopMapInset } from '../lib/geometry';
import { useFloorData } from '../model/useFloorData';
import { useRoutePath } from '../model/useRoutePath';
import { FloorMapSkeleton } from './FloorMapSkeleton';
import { RoutePoint } from './RoutePoint';

interface FloorMapProps {
    building: IBuilding,
    userGps: UserGPS | undefined,
    mapGps: IBuildingGps[] | undefined
}

export function FloorMap({ building, userGps, mapGps }: FloorMapProps) {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    const { innerWidth = 0, innerHeight = 0 } = useAppSelector(selectScreenSize);
    const currentFloor = useAppSelector(selectFloor);
    const points = useAppSelector(selectRoutePoints);

    const {
        rooms,
        services,
        mapSize,
        coordsPredictor,
        headingPredictor,
        isResolving
    } = useFloorData(currentFloor);
    const path = useRoutePath();

    const schemes = building.colorSchemes ?? [];
    const mapOffsetX = innerWidth > 1200 ? desktopMapInset(innerWidth) : innerWidth * 0.1;
    const routeSegments = points.from && points.to
        ? path?.[building.id]?.[currentFloor]
        : undefined;

    const isOnCurrentFloor = (point: typeof points.from) =>
        point && point.floorId === currentFloor && point.buildingId === building.id;

    const gpsMarker = mapGps && userGps && coordsPredictor
        ? {
            ...boundGpsToMap(coordsPredictor(userGps), mapSize),
            rotation: headingPredictor ? headingPredictor(userGps.heading) : 0
        }
        : undefined;

    if (isResolving) {
        return <FloorMapSkeleton />;
    }

    return (
        <FloorPlan
            floor={{
                width: mapSize.width,
                height: mapSize.height,
                rooms,
                services
            }}
            schemes={schemes}
            theme={theme === Theme.Dark ? 'dark' : 'light'}
            viewport={{ width: innerWidth, height: innerHeight }}
            offsetX={mapOffsetX}
            dragInsetX={desktopMapInset(innerWidth)}
            routeSegments={routeSegments}
            gpsMarker={gpsMarker}
            onRoomSelect={(pointId) => dispatch(selectPoint(pointId))}
        >
            {points.from && isOnCurrentFloor(points.from) &&
                <RoutePoint point={points.from} />
            }
            {points.to && isOnCurrentFloor(points.to) &&
                <RoutePoint point={points.to} />
            }
        </FloorPlan>
    )
}
