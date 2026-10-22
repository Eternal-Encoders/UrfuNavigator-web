import { useCallback, useEffect, useMemo } from 'react';
import { FloorPlan, type FloorPlanAnnotationOptions } from '@eternal-encoders/konva-floor-plan';
import { selectFloor } from '@/entities/floor';
import { selectPoint } from '@/entities/point';
import { selectRoutePoints } from '@/entities/route';
import { selectScreenSize, selectTheme, setPageReady, Theme } from '@/entities/viewer';
import type { IBuilding, IBuildingGps } from '@/shared/api';
import { boundGpsToMap, useAppDispatch, useAppSelector, type UserGPS } from '@/shared/lib';
import { mapNorth } from '../lib/north';
import { desktopMapInset } from '../lib/geometry';
import { useFloorData } from '../model/useFloorData';
import { useRoutePath } from '../model/useRoutePath';
import { FloorMapSkeleton } from './FloorMapSkeleton';
import { RoutePoint } from './RoutePoint';

const mapAnnotations: FloorPlanAnnotationOptions = {
    text: {
        minSize: 9, maxSize: 16, fadeStart: 4, fadeEnd: 8, fadeThresholdMultiplier: 0.75, keepUpright: true,
        fontFamily: 'Golos UI', fontStyle: 'normal', color: '#60636C'
    },
    icons: { minSize: 16, maxSize: 26, fadeStart: 8, fadeEnd: 16, keepUpright: true }
};

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
        gpsAltitude,
        headingPredictor,
        isResolving
    } = useFloorData(currentFloor);
    const path = useRoutePath();
    const north = useMemo(() => mapNorth(coordsPredictor, building.latitude, building.longitude, gpsAltitude),
        [coordsPredictor, building.latitude, building.longitude, gpsAltitude]);
    const publishRotation = useCallback((degrees: number) => {
        document.documentElement.style.setProperty('--floor-map-rotation', `${degrees}deg`);
    }, []);
    useEffect(() => {
        const style = document.documentElement.style;
        style.setProperty('--floor-map-north', `${north ?? 0}deg`);
        style.setProperty('--floor-map-compass-visibility', north === null ? 'hidden' : 'visible');
        return () => {
            style.removeProperty('--floor-map-north');
            style.removeProperty('--floor-map-compass-visibility');
        };
    }, [north]);
    useEffect(() => () => { document.documentElement.style.removeProperty('--floor-map-rotation'); }, []);
    useEffect(() => {
        dispatch(setPageReady(!isResolving));
    }, [dispatch, isResolving]);

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
            onRotationChange={publishRotation}
            annotations={mapAnnotations}
            gestures={{
                doubleTapScale: 2,
                doubleTapDuration: 220,
                rotationThreshold: 20,
                rotationSensitivity: 1.2,
                rotationSnapRange: 25,
                rotationSnapDuration: 220
            }}
            background={{
                pattern: 'dots-and-lines',
                color: theme === Theme.Dark ? '#0F1115' : '#F4F5F7'
            }}
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
