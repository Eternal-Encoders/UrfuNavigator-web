export interface Point {
    x: number,
    y: number
}

function getDistance(p1: Point, p2: Point) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1: Point, p2: Point) {
    return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
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

export {
    getDistance,
    getCenter,
    clamp,
    rotateByAngle,
    getBoundaries,
    boundPosition
}