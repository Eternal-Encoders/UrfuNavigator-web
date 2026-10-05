import Konva from 'konva';
import { RefObject, useCallback, useRef } from 'react';
import { Stage } from 'konva/lib/Stage';
import { selectScreenSize } from '@/entities/viewer';
import { useAppSelector } from '@/shared/lib';
import {
    boundPosition,
    clamp,
    getCenter,
    getDistance,
    normalizeAngleDelta,
    rotateByAngle,
    type Point,
    type Size
} from '../lib/geometry';

interface MapGesturesProps {
    mapSize: Size,
    stageRef: RefObject<Stage | null>
}

const SCALE_BY = 1.09;
const MAX_SCALE = 6;
const MIN_SCALE = 0.09;
const POSITION_THRESHOLD = 100;
const ROTATION_THRESHOLD = 30;

export function useMapGestures({ mapSize, stageRef }: MapGesturesProps) {
    const { innerHeight, innerWidth } = useAppSelector(selectScreenSize)

    const lastCenterRef = useRef<Point | null>(null);
    const lastDistRef = useRef(0);
    const lastAngleRef = useRef<number | null>(null);
    const cumulativeRotationRef = useRef(0);

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
    }, [innerHeight, innerWidth, mapSize, stageRef])

    const calcResize = useCallback((p1: Point, p2: Point, stage: Stage) => {
        const centre = getCenter(p1, p2);
        if (!lastCenterRef.current || lastDistRef.current === 0) {
            lastCenterRef.current = centre;
        }

        const dist = getDistance(p1, p2);
        if (!lastDistRef.current) {
            lastDistRef.current = dist;
        }

        const scale = clamp(stage.scaleX() * (dist / lastDistRef.current), MIN_SCALE, MAX_SCALE);
        let newPos = {
            x: centre.x - ((centre.x - stage.x()) / stage.scaleX()) * scale + (centre.x - lastCenterRef.current.x),
            y: centre.y - ((centre.y - stage.y()) / stage.scaleX()) * scale + (centre.y - lastCenterRef.current.y)
        };

        const arcCos1 = Math.acos((p1.x - centre.x) / getDistance(p1, centre));
        let angle = (p1.y - centre.y < 0 ? 2 * Math.PI - arcCos1 : arcCos1) * (180 / Math.PI);
        if (lastAngleRef.current === null) {
            lastAngleRef.current = angle;
        }
        let deltaAngle = normalizeAngleDelta(angle - lastAngleRef.current);

        if (Math.abs(cumulativeRotationRef.current) <= ROTATION_THRESHOLD) {
            cumulativeRotationRef.current += deltaAngle;
            deltaAngle = 0
            angle = lastAngleRef.current
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
    }, [])

    const calcMove = useCallback((p1: Point, stage: Stage) => {
        if (!lastCenterRef.current) {
            lastCenterRef.current = p1;
        }

        const newPos = {
            x: p1.x - (p1.x - stage.x()) + (p1.x - lastCenterRef.current.x),
            y: p1.y - (p1.y - stage.y()) + (p1.y - lastCenterRef.current.y)
        };

        return {
            newPosition: newPos,
            scale: stage.getAbsoluteScale().x,
            rotation: stage.getAbsoluteRotation(),
            dAngle: 0,
            dist: 0,
            centre: p1
        }
    }, [])

    const containerPoint = useCallback((stage: Stage, touch: Touch): Point => {
        const rect = stage.container().getBoundingClientRect();
        return {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
    }, [])

    const handleTouch = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
        e.evt.preventDefault();
        if (!stageRef.current) {
            return;
        }
        const stage = stageRef.current;

        if (stage.isDragging()) {
            stage.stopDrag();
        }

        const p1 = containerPoint(stage, e.evt.touches[0]);

        const data = e.evt.touches[1]
            ? calcResize(p1, containerPoint(stage, e.evt.touches[1]), stage)
            : calcMove(p1, stage)

        const boundedNewPos = boundPosition(
            data.newPosition,
            mapSize,
            { x: data.scale, y: data.scale },
            stage.getAbsoluteRotation() + data.dAngle,
            POSITION_THRESHOLD,
            innerWidth,
            innerHeight
        );

        stage.scaleX(data.scale);
        stage.scaleY(data.scale);
        stage.rotate(data.dAngle);
        stage.position(boundedNewPos);

        lastDistRef.current = data.dist;
        lastAngleRef.current = data.rotation;
        lastCenterRef.current = data.centre;

        stage.batchDraw();
    }, [calcMove, calcResize, containerPoint, innerHeight, innerWidth, mapSize, stageRef])

    const resetGesture = useCallback(() => {
        lastCenterRef.current = null;
        lastDistRef.current = 0;
        lastAngleRef.current = null;
        cumulativeRotationRef.current = 0;
    }, [])

    const handleTouchEnd = useCallback((e: Konva.KonvaEventObject<TouchEvent>) => {
        const stage = stageRef.current;
        const touches = e.evt.touches;
        if (!stage || touches.length === 0) {
            resetGesture();
            return;
        }

        if (touches.length === 1) {
            lastCenterRef.current = containerPoint(stage, touches[0]);
            lastDistRef.current = 0;
            lastAngleRef.current = null;
            cumulativeRotationRef.current = 0;
            return;
        }

        const p1 = containerPoint(stage, touches[0]);
        const p2 = containerPoint(stage, touches[1]);
        lastCenterRef.current = getCenter(p1, p2);
        lastDistRef.current = getDistance(p1, p2);
        lastAngleRef.current = null;
        cumulativeRotationRef.current = 0;
    }, [containerPoint, resetGesture, stageRef])

    const handelDragBound = useCallback(function rawHandelDragBound(this: Konva.Node, pos: Konva.Vector2d) {
        return boundPosition(
            pos,
            mapSize,
            this.getAbsoluteScale(),
            this.getAbsoluteRotation(),
            POSITION_THRESHOLD,
            innerWidth,
            innerHeight
        );
    }, [innerHeight, innerWidth, mapSize])

    return {
        innerWidth,
        innerHeight,
        handelDragBound,
        zoomStage,
        handleTouch,
        handleTouchEnd
    }
}
