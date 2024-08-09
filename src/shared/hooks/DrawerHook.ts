import { TouchEvent, TouchList, useState } from "react"
import { DrawerOrient } from "../../utils/interfaces";


function touchesToPos(touches: TouchList, orient: DrawerOrient): number {
    let sumOf = 0;
    
    for (let i=0; i < touches.length; i++) {
        switch (orient) {
            case DrawerOrient.Horizontal:
                sumOf += touches[i].clientX;
                break;
            case DrawerOrient.Vertical:
                sumOf += touches[i].clientY;
                break;
        }        
    }

    return sumOf / touches.length;
}

function translatePart(num: number, orient: DrawerOrient) {
    if (num > 0 && num <= 1) {
        switch (orient) {
            case DrawerOrient.Horizontal:
                return window.innerWidth * num;
            case DrawerOrient.Vertical:
                return window.innerHeight * num;
        }
    }
    return num;
}

export function useDrawer(
    initialPosition: number,
    breakePoints: [number, number, number],
    orient: DrawerOrient
) {
    initialPosition = translatePart(initialPosition, orient);
    // @ts-expect-error
    breakePoints = breakePoints.map((e) => translatePart(e, orient));
    
    breakePoints = breakePoints.sort();
    const minPos = breakePoints[0];
    const middlePos = breakePoints[1];
    const maxPos = breakePoints[2];


    const [position, setPosition] = useState(initialPosition);
    const [lastPos, setLastPos] = useState<number | undefined>(undefined);

    function _setPosTo(pos: number) {
        setPosition(translatePart(pos, orient));
        setLastPos(undefined);
    }

    function _isNear(point: number, threshold=0) {
        return position <= point + threshold && position >= point - threshold;
    }

    function touchStartHandle(e: TouchEvent<HTMLDivElement>) {
        setLastPos(touchesToPos(e.touches, orient));
    }

    function touchMoveHandle(e: TouchEvent<HTMLDivElement>) {
        if (!lastPos) {
            return;
        }

        const clientPos = touchesToPos(e.touches, orient);
        
        const delta = clientPos - lastPos

        setLastPos(clientPos);
        setPosition(
            Math.max(
                minPos, 
                Math.min(
                    position - delta, 
                    maxPos
                )
            )
        );
    }

    function touchEndHandle() {
        setLastPos(undefined);
    }

    function setPosTo(pos: number) {
        _setPosTo(translatePart(pos, orient));
    }

    function setPosToMin() {
        _setPosTo(minPos);
    }

    function setPosToMiddle() {
        _setPosTo(middlePos);
    }

    function setPosToMax() {
        _setPosTo(maxPos);
    }

    function isNearMin(threshold=0) {
        return _isNear(minPos, threshold);
    }

    function isNearMiddle(threshold=0) {
        return _isNear(middlePos, threshold);
    }

    function isNearMax(threshold=0) {
        return _isNear(maxPos, threshold);
    }

    return {
        position,
        touchStartHandle,
        touchMoveHandle,
        touchEndHandle,
        setPosToMin,
        setPosToMiddle,
        setPosToMax,
        setPosTo,
        isNearMin,
        isNearMiddle,
        isNearMax
    }
}