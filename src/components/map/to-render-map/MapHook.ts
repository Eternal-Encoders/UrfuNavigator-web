import Konva from "konva";
import { RefObject, useEffect, useState } from "react";

interface Point {
    x: number,
    y: number
}

interface MapHookProps {
    mapSize: {
        width: number,
        height: number
    },
    stageRef: RefObject<Konva.Stage>
}

export function useMapHook({ mapSize, stageRef }: MapHookProps) {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const SCALE_BY = 1.09;
    const MAX_SCALE = 6;
    const MIN_SCALE = 0.09;
    const POSITION_THRESHOLD = 100;
    const ROTATION_THRESHOLD = 30;

    let lastCenter: Point | null = null;
    let tempRotation = 0;
    let lastDist = 0;
    let lastAngle: number | null = null;

    /* ON RESIZE */
    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    function getDistance(p1: Point, p2: Point) {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }
    
    function getCenter(p1: Point, p2: Point) {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    }
    
    function isTouchEnabled() { 
      return ( 'ontouchstart' in window ) ||  
             ( navigator.maxTouchPoints > 0 ); 
    } 
    
    function clamp(value: number, minValue: number, maxValue: number) {
        return Math.min(Math.max(value, minValue), maxValue);
    }
    
    function rotateByAngle(position: Point, rotationPoint: Point, rotationAngle: number): Point {
        return {
            x: rotationPoint.x + 
                (position.x - rotationPoint.x) * Math.cos(rotationAngle / 180 * Math.PI) - 
                (position.y - rotationPoint.y) * Math.sin(rotationAngle / 180 * Math.PI),
            y: rotationPoint.y + 
                (position.x - rotationPoint.x) * Math.sin(rotationAngle / 180 * Math.PI) +
                (position.y - rotationPoint.y) * Math.cos(rotationAngle / 180 * Math.PI)
        }
    }
    
    function getBoundaries(
        mapSize: {width: number, height: number},
        scale: Point,
        rotationAngle: number
    ) {
        const mapPoints = {
            topLeft: {x: 0, y: 0},
            topRight: {x: -mapSize.width * scale.x, y: 0},
            leftBottom: {x: 0, y: -mapSize.height * scale.y},
            rightBottom: {x: -mapSize.width * scale.x, y: -mapSize.height * scale.y},
        }
    
        const rotatedMappoints = [
            rotateByAngle(mapPoints.topLeft, mapPoints.topLeft, rotationAngle),
            rotateByAngle(mapPoints.topRight, mapPoints.topLeft, rotationAngle),
            rotateByAngle(mapPoints.leftBottom, mapPoints.topLeft, rotationAngle),
            rotateByAngle(mapPoints.rightBottom, mapPoints.topLeft, rotationAngle),
        ];
    
        let left = Number.MIN_VALUE;
        let top = Number.MIN_VALUE;
        let right = Number.MAX_VALUE;
        let bottom = Number.MAX_VALUE;
    
        rotatedMappoints.forEach((e) => {
            left = Math.max(left, e.x);
            top = Math.max(top, e.y);
            right = Math.min(right, e.x);
            bottom = Math.min(bottom, e.y);
        });
    
        return {
            left,
            top,
            right,
            bottom
        }
    }
    
    function boundPosition(
        pos: Point, 
        mapSize: {width: number, height: number},
        scale: Point,
        rotationAngle: number,
        maxPositionThreshold: number,
        width: number,
        height: number
    ) {
        const desktopFix = width > 1200 ? width * 0.27: 0;
    
        const bounds = getBoundaries(mapSize, scale, rotationAngle);
    
        const viewRect = {
            left: bounds.left + width - maxPositionThreshold,
            top: bounds.top + height - maxPositionThreshold,
            right: bounds.right + desktopFix + maxPositionThreshold,
            bottom: bounds.bottom + maxPositionThreshold
        }
    
        return {
            x: clamp(
                pos.x,
                viewRect.right,
                viewRect.left
            ),
            y: clamp(
                pos.y,
                viewRect.bottom,
                viewRect.top,
            )
        };
    }

    function zoomStage(event: Konva.KonvaEventObject<WheelEvent>) {
        event.evt.preventDefault();
        if (stageRef.current !== null) {
            const stage = stageRef.current;
            if (!stage) {
                return;
            }

            const oldScale = stage.scaleX();
            const pointerPos = stage.getPointerPosition();
            if (pointerPos) {
                const mousePointTo = {
                    x: (pointerPos.x - stage.x()) / oldScale,
                    y: (pointerPos.y - stage.y()) / oldScale,
                };

                const newScale = clamp(event.evt.deltaY < 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY, MIN_SCALE, MAX_SCALE);
                stage.scale({ x: newScale, y: newScale });

                const newPos = {
                    x: pointerPos.x - mousePointTo.x * newScale,
                    y: pointerPos.y - mousePointTo.y * newScale,
                }
                stage.position(boundPosition(
                    newPos, 
                    mapSize, 
                    {x: newScale, y: newScale},
                    stage.getAbsoluteRotation(),
                    POSITION_THRESHOLD,
                    width,
                    height
                ));
                stage.batchDraw();
            }
        }
    }

    function handleTouch(e: Konva.KonvaEventObject<TouchEvent>) {
        e.evt.preventDefault();
        const touch1 = e.evt.touches[0];
        const touch2: Touch | undefined = e.evt.touches[1];
        const stage = stageRef.current;

        /*
            TODO: Унифицировать - избавиться от дублирования кода
        */

        if (stage !== null) {
            if (stage.isDragging()) {
                stage.stopDrag();
            }

            const p1 = {
                x: touch1.clientX,
                y: touch1.clientY
            };
            
            if (touch2) {
                const p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY
                };
        
                if (!lastCenter || lastDist === 0) {
                    lastCenter = getCenter(p1, p2);
                }
                const newCenter = getCenter(p1, p2);

                const arcCos1 = Math.acos((p1.x - newCenter.x) / getDistance(p1, newCenter));

                const newAngle = (p1.y - newCenter.y < 0 ? 2*Math.PI - arcCos1: arcCos1) * (180 / Math.PI);

                if(!lastAngle) {
                    lastAngle = newAngle;
                }

                const deltaAngle = newAngle - lastAngle;
        
                const dist = getDistance(p1, p2);
        
                if (!lastDist) {
                    lastDist = dist;
                }
        
                const pointTo = {
                    x: (newCenter.x - stage.x()) / stage.scaleX(),
                    y: (newCenter.y - stage.y()) / stage.scaleX()
                };
        
                const scale = clamp(stage.scaleX() * (dist / lastDist), MIN_SCALE, MAX_SCALE);
        
                stage.scaleX(scale);
                stage.scaleY(scale);

                const dx = newCenter.x - lastCenter.x;
                const dy = newCenter.y - lastCenter.y;
        
                const newPos = {
                    x: newCenter.x - pointTo.x * scale + dx,
                    y: newCenter.y - pointTo.y * scale + dy
                };

                if(Math.abs(tempRotation) <= ROTATION_THRESHOLD) {
                    tempRotation += deltaAngle;
                    const boundedNewPos = boundPosition(
                        newPos, 
                        mapSize, 
                        {x: scale, y: scale},
                        stage.getAbsoluteRotation(),
                        POSITION_THRESHOLD,
                        width,
                        height
                    );
                    stage.position(boundedNewPos);
                } else {
                    const actualPos = rotateByAngle(newPos, newCenter, deltaAngle);
                    const boundedNewPos = boundPosition(
                        actualPos, 
                        mapSize, 
                        {x: scale, y: scale},
                        stage.getAbsoluteRotation() + deltaAngle,
                        POSITION_THRESHOLD,
                        width,
                        height
                    );
                    stage.rotate(deltaAngle);
                    stage.position(boundedNewPos);
                }
        
                lastDist = dist;
                lastAngle = newAngle;
                lastCenter = newCenter;
            } else {
                if (!lastCenter) {
                    lastCenter = p1;
                }

                const pointTo = {
                    x: (p1.x - stage.x()),
                    y: (p1.y - stage.y())
                };
        
                const dx = p1.x - lastCenter.x;
                const dy = p1.y - lastCenter.y;
        
                const newPos = {
                    x: p1.x - pointTo.x + dx,
                    y: p1.y - pointTo.y + dy
                };

                const scale = stage.getAbsoluteScale();

                const boundedNewPos = boundPosition(
                    newPos, 
                    mapSize,  
                    scale,
                    stage.getAbsoluteRotation(),
                    POSITION_THRESHOLD,
                    width,
                    height
                );
        
                stage.position(boundedNewPos);

                lastCenter = p1;
            }

            stage.batchDraw();
        }
    }

    function handleTouchEnd() {
        lastCenter = null;
        lastDist = 0;
        lastAngle = null;
        tempRotation = 0;
    }

    function handelDragBound(this: Konva.Node, pos: Konva.Vector2d) {
        const scale = this.getAbsoluteScale();
        const res = boundPosition(
            pos, 
            mapSize, 
            scale, 
            this.getAbsoluteRotation(), 
            POSITION_THRESHOLD,
            width,
            height
        );

        return res;
    }

    return {
        width,
        height,
        isTouchEnabled,
        handelDragBound,
        zoomStage,
        handleTouch,
        handleTouchEnd
    }
}