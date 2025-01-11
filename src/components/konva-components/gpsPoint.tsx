import React from "react";
import { Circle } from "react-konva";

interface GpsPointProps {
    coords: {x: number, y: number}
}

function GpsPoint({ coords }: GpsPointProps) {
    return (
        <Circle
            x={coords.x}
            y={coords.y}
            width={30}
            height={30}
            fill={'#000000'}
        />
    )
}

export default React.memo(GpsPoint);