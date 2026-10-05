import Konva from 'konva';
import { useRef } from 'react';
import { Layer, Rect, Stage } from 'react-konva';

import { selectFloor } from '@/entities/floor';
import { selectRoutePoints } from '@/entities/route';
import { selectTheme } from '@/entities/viewer';
import type { IBuilding, IBuildingGps } from '@/shared/api';
import { boundGpsToMap, useAppSelector, type UserGPS } from '@/shared/lib';
import { desktopMapInset } from '../lib/geometry';
import { buildingBackground } from '../lib/mapColors';
import { useFloorData } from '../model/useFloorData';
import { useMapGestures } from '../model/useMapGestures';
import GpsMarker from './konva/GpsMarker';
import { FloorMapSkeleton } from './FloorMapSkeleton';
import { getRooms, getServices } from './MapShapes';
import { RouteLayer } from './RouteLayer';
import { RoutePoint } from './RoutePoint';

interface FloorMapProps {
    building: IBuilding,
    userGps: UserGPS | undefined,
    mapGps: IBuildingGps[] | undefined
}

export function FloorMap({ building, userGps, mapGps }: FloorMapProps) {
    const stageRef = useRef<Konva.Stage | null>(null);
    const theme = useAppSelector(selectTheme);
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
    const {
        innerWidth,
        innerHeight,
        handelDragBound,
        zoomStage,
        handleTouch,
        handleTouchEnd
    } = useMapGestures({ mapSize, stageRef });

    const schemes = building.colorSchemes ?? [];
    const mapOffsetX = innerWidth > 1200 ? desktopMapInset(innerWidth) : innerWidth * 0.1;
    const stageScale = Math.min(innerHeight, innerWidth) / 3500;
    const background = buildingBackground(schemes, theme);

    const isOnCurrentFloor = (point: typeof points.from) =>
        point && point.floorId === currentFloor && point.buildingId === building.id;

    if (isResolving) {
        return <FloorMapSkeleton />;
    }

    return (
        <Stage
            width={innerWidth}
            height={innerHeight}
            x={mapOffsetX}
            scaleX={stageScale}
            scaleY={stageScale}
            className="overflow-hidden"
            draggable
            dragBoundFunc={handelDragBound}
            onWheel={zoomStage}
            onTouchMove={handleTouch}
            onTouchEnd={handleTouchEnd}
            ref={stageRef}
        >
            <Layer>
                {background && mapSize.width > 0 &&
                    <Rect
                        x={0}
                        y={0}
                        width={mapSize.width}
                        height={mapSize.height}
                        fill={background}
                        listening={false}
                    />
                }
                {getRooms(rooms, schemes, theme)}
                {getServices(services, schemes, theme)}
                {points.from && points.to &&
                    <RouteLayer buildingId={building.id} floorId={currentFloor} />
                }
                {points.from && isOnCurrentFloor(points.from) &&
                    <RoutePoint point={points.from} />
                }
                {points.to && isOnCurrentFloor(points.to) &&
                    <RoutePoint point={points.to} />
                }
                {mapGps && userGps && coordsPredictor &&
                    <GpsMarker
                        coords={boundGpsToMap(coordsPredictor(userGps), mapSize)}
                        rotation={headingPredictor ? headingPredictor(userGps.heading) : 0}
                    />
                }
            </Layer>
        </Stage>
    )
}
