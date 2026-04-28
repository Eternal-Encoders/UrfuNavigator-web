import React from "react";
import { Circle, Group, RegularPolygon } from "react-konva";

interface GpsPointProps {
    coords: {x: number, y: number}
    rotation: number
}

const SIZE = 50

function GpsPoint({ coords, rotation }: GpsPointProps) {
    return (
        <Group
            x={coords.x}
            y={coords.y}
            rotation={rotation}
        >
            <RegularPolygon
                x={SIZE / 2}
                rotation={-30}
                sides={3}
                radius={SIZE*0.4}
                fill={'#DD2020'}
            />
            <Circle
                width={SIZE}
                height={SIZE}
                fill={'#FFFFFF'}
                shadowEnabled
                shadowColor="#000000"
                shadowOpacity={0.4}
                shadowBlur={0.96}
            />
            <Circle
                width={SIZE*0.62}
                height={SIZE*0.62}
                fill={'#DD2020'}
            />
        </Group>
    )
}

export default React.memo(GpsPoint);