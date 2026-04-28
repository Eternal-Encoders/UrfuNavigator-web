import Konva from 'konva';
import { RefObject, useCallback, useEffect, useState } from 'react';
import { useAppSelector } from '../../../store/hook';
import { selectIsTouchEnabled, selectScreenSize } from '../../../features/rootData/rootDataSlice';
import { boundPosition, clamp, getCenter, getDistance, Point, rotateByAngle } from './mapUtils';
import { Stage } from 'konva/lib/Stage';
import { useGetFloorQuery } from '../../../features/api/apiSlice';
import { selectFloor } from '../../../features/floor/floorSlice';
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice';
import { IAuditorium, IFloorGps, IInstituteGps, IService, UserGPS } from '../../../utils/interfaces';
import { createPredictor } from '../../../utils/gps';

interface MapManipulationProps {
    mapSize: {
        width: number,
        height: number
    },
    stageRef: RefObject<Stage | null>
}

interface MapHookProps {
    name: string,
    mapGps: IInstituteGps[] | undefined,
    stageRef: RefObject<Stage | null>
}

function useMapManipulation({ mapSize, stageRef }: MapManipulationProps) {
    const SCALE_BY = 1.09;
    const MAX_SCALE = 6;
    const MIN_SCALE = 0.09;
    const POSITION_THRESHOLD = 100;
    const ROTATION_THRESHOLD = 30;

    const { innerHeight, innerWidth } = useAppSelector(selectScreenSize)
    const isTouchEnabled = useAppSelector(selectIsTouchEnabled)

    let lastCenter: Point | null = null;
    let lastDist = 0;
    let lastAngle: number | null = null;
    let cumulativeRotation = 0;

    const zoomStage = useCallback((event: Konva.KonvaEventObject<WheelEvent>) => {
        event.evt.preventDefault();
        if (!stageRef.current) {
            return;
        }

        const stage = stageRef.current;

        let scale = stage.scaleX();
        const pointerPos = stage.getPointerPosition();

        if (!pointerPos) {
            return;
        }

        const mousePointTo = {
            x: (pointerPos.x - stage.x()) / scale,
            y: (pointerPos.y - stage.y()) / scale,
        };

        scale = event.evt.deltaY < 0 ? scale * SCALE_BY : scale / SCALE_BY
        scale = clamp(scale, MIN_SCALE, MAX_SCALE);

        stage.scale({ x: scale, y: scale });

        const newPos = {
            x: pointerPos.x - mousePointTo.x * scale,
            y: pointerPos.y - mousePointTo.y * scale,
        }
        stage.position(boundPosition(
            newPos, 
            mapSize, 
            {
                x: scale,
                y: scale
            },
            stage.getAbsoluteRotation(),
            POSITION_THRESHOLD,
            innerWidth,
            innerHeight
        ));
        stage.batchDraw();
    }, [innerHeight, innerWidth, mapSize])

    const calcResize= useCallback((p1: Point, p2: Point, stage: Stage) => {
        const centre = getCenter(p1, p2);
        if (!lastCenter || lastDist === 0) {
            lastCenter = centre;
        }

        const dist = getDistance(p1, p2);
        if (!lastDist) {
            lastDist = dist;
        }

        const scale = clamp(stage.scaleX() * (dist / lastDist), MIN_SCALE, MAX_SCALE);
        let newPos = {
            x: centre.x - ((centre.x - stage.x()) / stage.scaleX()) * scale + (centre.x - lastCenter.x),
            y: centre.y - ((centre.y - stage.y()) / stage.scaleX()) * scale + (centre.y - lastCenter.y)
        };

        const arcCos1 = Math.acos((p1.x - centre.x) / getDistance(p1, centre));
        let angle = (p1.y - centre.y < 0 ? 2*Math.PI - arcCos1: arcCos1) * (180 / Math.PI);
        if(!lastAngle) {
            lastAngle = angle;
        }
        let deltaAngle = angle - lastAngle;

        if (Math.abs(cumulativeRotation) <= ROTATION_THRESHOLD) {
            cumulativeRotation += deltaAngle;
            deltaAngle = 0
            angle = lastAngle
        }

        newPos = rotateByAngle(newPos, centre, deltaAngle);

        return {
            newPosition: newPos,
            scale: scale,
            rotation: angle,
            dAngle: deltaAngle,
            dist: dist,
            centre: centre,
        }
    }, [innerHeight, innerWidth, mapSize])

    const calcMove = useCallback((p1: Point, stage: Stage) => {
        if (!lastCenter) {
            lastCenter = p1;
        }

        const newPos = {
            x: p1.x - (p1.x - stage.x()) + (p1.x - lastCenter.x),
            y: p1.y - (p1.y - stage.y()) + (p1.y - lastCenter.y)
        };

        return {
            newPosition: newPos,
            scale: stage.getAbsoluteScale().x,
            rotation: stage.getAbsoluteRotation(),
            dAngle: 0,
            dist: 0,
            centre: p1
        }
    }, [innerHeight, innerWidth, mapSize])

    const handleTouch = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
        e.evt.preventDefault();
        if (!stageRef.current) {
            return;
        }
        const stage = stageRef.current;

        if (stage.isDragging()) {
            stage.stopDrag();
        }

        const p1 = {
            x: e.evt.touches[0].clientX,
            y: e.evt.touches[0].clientY
        };

        let data = undefined

        if (e.evt.touches[1]) {
            const p2 = {
                x: e.evt.touches[1].clientX,
                y: e.evt.touches[1].clientY
            }

            data = calcResize(p1, p2, stage)
        } else {
            data = calcMove(p1, stage)
        }

        if (!data) {
            return
        }

        const boundedNewPos = boundPosition(
            data.newPosition, 
            mapSize, 
            {x: data.scale, y: data.scale},
            stage.getAbsoluteRotation() + data.dAngle,
            POSITION_THRESHOLD,
            innerWidth,
            innerHeight
        );

        stage.scaleX(data.scale);
        stage.scaleY(data.scale);
        stage.rotate(data.dAngle);
        stage.position(boundedNewPos);

        lastDist = data.dist;
        lastAngle = data.rotation;
        lastCenter = data.centre;
            
        stage.batchDraw();
    }, [innerHeight, innerWidth, mapSize])

    const handleTouchEnd = useCallback(() => {
        lastCenter = null;
        lastDist = 0;
        lastAngle = null;
        cumulativeRotation = 0;
    }, [])


    function rawHandelDragBound(this: Konva.Node, pos: Konva.Vector2d) {
        return boundPosition(
            pos, 
            mapSize, 
            this.getAbsoluteScale(), 
            this.getAbsoluteRotation(), 
            POSITION_THRESHOLD,
            innerWidth,
            innerHeight
        );
    }

    const handelDragBound = useCallback(rawHandelDragBound, [innerWidth, innerHeight, mapSize])

    return {
        innerWidth,
        innerHeight,
        isTouchEnabled,
        handelDragBound,
        zoomStage,
        handleTouch,
        handleTouchEnd
    }
}

export function useMapHook({ name, mapGps, stageRef }: MapHookProps) {
    const currentFloor = useAppSelector(selectFloor);
    const points = useAppSelector(selectSearchPoints);
    const { data } = useGetFloorQuery({
        inst: name,
        floor: currentFloor
    })

    const [innerState, setinnerState] = useState<{
        instituteGps: IFloorGps | null ,
        coordsPredictor: ((loc: UserGPS) => {x: number, y: number}) | null,
        headingPredictor: ((heading: number) => number) | null,
        floor: IAuditorium[],
        services: IService[],
        mapSize: {
            width: number,
            height: number
        }
    }>({
        instituteGps: null,
        coordsPredictor: null,
        headingPredictor: null,
        floor: [],
        services: [],
        mapSize: {
            width: 0,
            height: 0
        }
    })

    useEffect(() => {
        if (data) {
            const [coordsPredictor, headingPredictor] = data.gps ? createPredictor(data.gps) : [null, null]
            setinnerState({
                instituteGps: data.gps ? data.gps : null,
                coordsPredictor: coordsPredictor,
                headingPredictor: headingPredictor,
                floor: data.audiences,
                services: data.service,
                mapSize: {
                    width: data.width,
                    height: data.height
                }
            })
        }
    }, [data, mapGps])

    const mapManipulationData = useMapManipulation({ mapSize: innerState.mapSize , stageRef })

    return {
        mapManipulationData,
        coordsPredictor: innerState.coordsPredictor,
        headingPredictor: innerState.headingPredictor,
        floor: innerState.floor,
        services: innerState.services,
        mapSize: innerState.mapSize,
        points,
        currentFloor
    }
}