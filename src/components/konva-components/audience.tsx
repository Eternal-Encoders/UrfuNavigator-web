import React from 'react';
import { Group, Rect } from 'react-konva';

interface AudienceProps {
    x: number,
    y: number,
    width: number,
    height: number,
    stroke?: string,
    fill?: string,
    children?: React.ReactNode[]
}

function Audience({
    x,
    y,
    width,
    height,
    stroke,
    fill,
    children
}: AudienceProps) {
    return (
        <Group x={x} y={y}>
            <Rect 
                width={width} 
                height={height} 
                fill={fill ? fill: ''}
                stroke={stroke ? stroke: ''}
                strokeWidth={stroke ? 5: 0}
            />
            {children}
        </Group>
    )
}

export default React.memo(Audience);