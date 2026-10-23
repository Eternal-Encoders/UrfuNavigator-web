import { useCallback, useEffect, useMemo, useRef } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import { FloorPlan, floorContentView, floorAlignment, type FloorPlanCamera, type FloorPlanAnnotationOptions } from '@eternal-encoders/konva-floor-plan';
import { selectFloor, useGetFloorQuery } from '@/entities/floor';
import { selectPoint, selectPointPresentation, useGetPointsQuery } from '@/entities/point';
import { selectRoutePoints } from '@/entities/route';
import { selectPanelState } from '@/entities/sidebar';
import { selectScreenSize, selectTheme, setPageReady, Theme } from '@/entities/viewer';
import { PointTypes, type IBuilding, type IBuildingGps } from '@/shared/api';
import { boundGpsToMap, useAppDispatch, useAppSelector, type UserGPS } from '@/shared/lib';
import { mapNorth } from '../lib/north';
import { initialMapAnchor } from '../lib/initialView';
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
    const cameraSnapshots = useRef(new Map<string, FloorPlanCamera>());
    const rememberCamera = useCallback((camera: FloorPlanCamera) => {
        cameraSnapshots.current.set(building.id, camera);
    }, [building.id]);
    const savedCamera = cameraSnapshots.current.get(building.id);
    const theme = useAppSelector(selectTheme);
    const { innerWidth = 0, innerHeight = 0 } = useAppSelector(selectScreenSize);
    const currentFloor = useAppSelector(selectFloor);
    const { restingHeight } = useAppSelector(selectPanelState);
    const points = useAppSelector(selectRoutePoints);
    const { pointId: selectedPointId, previewEnabled, focus, focusVersion, focusAnimate }
        = useAppSelector(selectPointPresentation);

    const firstFloorId = building.floors.find(floor => Number(floor.displayableName) === 1)?.id;
    const { currentData: referenceData } = useGetFloorQuery(
        firstFloorId && currentFloor !== firstFloorId ? firstFloorId : skipToken);
    const referenceFloor = useMemo(() => currentFloor !== firstFloorId && referenceData?.id === firstFloorId
        && referenceData?.buildingId === building.id ? {
            width: referenceData.width, height: referenceData.height,
            rooms: referenceData.rooms ?? [], services: referenceData.services ?? []
        } : undefined, [referenceData, firstFloorId, building.id, currentFloor]);
    const firstFloor = Number(building.floors.find(floor => floor.id === currentFloor)?.displayableName) === 1;
    const searchFocus = previewEnabled && focus?.floorId === currentFloor && focus.buildingId === building.id;
    const { currentData: entrances, isFetching: entrancesLoading } = useGetPointsQuery(firstFloor && !searchFocus
        ? { buildingId: building.id, floorId: currentFloor, type: PointTypes.Exit, length: 100 } : skipToken);

    const {
        rooms,
        services,
        mapSize,
        coordsPredictor,
        gpsAltitude,
        headingPredictor,
        isResolving
    } = useFloorData(currentFloor);
    const presentedFloor = useRef<string | null>(null);
    const floorKey = `${building.id}:${currentFloor}`;
    const waitingForEntrance = !savedCamera && firstFloor && !searchFocus && entrancesLoading && !entrances
        && presentedFloor.current !== floorKey;
    if (!isResolving && !waitingForEntrance) presentedFloor.current = floorKey;
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
        dispatch(setPageReady(!isResolving && !waitingForEntrance));
    }, [dispatch, isResolving, waitingForEntrance]);

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

    const visibleWidth = Math.max(1, innerWidth - desktopMapInset(innerWidth));
    const visibleHeight = Math.max(1, innerHeight - (innerWidth > 1200 ? 0 : restingHeight));
    const contentView = useMemo(() => floorContentView({ ...mapSize, rooms, services },
        { width: visibleWidth, height: visibleHeight }, 24), [mapSize, rooms, services, visibleWidth, visibleHeight]);

    const floorOffset = useMemo(() => floorAlignment({ ...mapSize, rooms, services }, referenceFloor),
        [mapSize, rooms, services, referenceFloor]);
    const initialAnchor = initialMapAnchor(mapSize.width, mapSize.height, firstFloor, entrances, contentView);

    if (isResolving || waitingForEntrance) {
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
            referenceFloor={referenceFloor}
            floorOffset={floorOffset}
            cameraKey={floorKey}
            initialCamera={savedCamera}
            onCameraChange={rememberCamera}
            initialView={savedCamera ? undefined : { key: `${building.id}:${currentFloor}`,
                x: initialAnchor.x + floorOffset.x, y: initialAnchor.y + floorOffset.y,
                center: { x: innerWidth > 1200 ? (innerWidth + desktopMapInset(innerWidth)) / 2 : innerWidth / 2,
                    y: visibleHeight / 2 } }}
            schemes={schemes}
            theme={theme === Theme.Dark ? 'dark' : 'light'}
            viewport={{ width: innerWidth, height: innerHeight }}
            offsetX={mapOffsetX}
            dragInsetX={desktopMapInset(innerWidth)}
            focus={previewEnabled && focus && focus.floorId === currentFloor && focus.buildingId === building.id ? {
                pointId: focus.id, x: focus.x, y: focus.y, requestId: focusVersion,
                center: { x: innerWidth > 1200 ? (innerWidth + desktopMapInset(innerWidth)) / 2 : innerWidth / 2,
                    y: innerWidth > 1200 ? innerHeight / 2 : Math.max(80, (innerHeight - 244) / 2) },
                duration: focusAnimate ? 300 : 0, minScale: 0.3,
                fill: theme === Theme.Dark ? '#36587C' : '#D8EAFE', stroke: '#4A90E2'
            } : selectedPointId ? {
                pointId: selectedPointId, x: 0, y: 0, requestId: focusVersion,
                center: { x: 0, y: 0 }, camera: false,
                fill: theme === Theme.Dark ? '#36587C' : '#D8EAFE', stroke: '#4A90E2'
            } : undefined}
            onRotationChange={publishRotation}
            annotations={mapAnnotations}
            gestures={{
                doubleTapScale: 2,
                doubleTapDuration: 220,
                rotationThreshold: 20,
                rotationSensitivity: 1.2,
                rotationSnapRange: 25,
                rotationSnapDuringGesture: true,
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
