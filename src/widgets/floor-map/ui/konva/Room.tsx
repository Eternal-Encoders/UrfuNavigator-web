import React from 'react';
import { Group, Rect } from 'react-konva';
import { selectPoint } from '@/entities/point';
import { useAppDispatch } from '@/shared/lib';

interface RoomProps {
    id: string,
    pointId?: string | null,
    x: number,
    y: number,
    width: number,
    height: number,
    stroke?: string,
    fill?: string,
    children?: React.ReactNode
}

function Room({
    id,
    pointId,
    x,
    y,
    width,
    height,
    stroke,
    fill,
    children
}: RoomProps) {
    const dispatch = useAppDispatch();

    function clickHandle() {
        if (pointId) {
            dispatch(selectPoint(pointId))
        }
    }

    return (
        <Group id={id} x={x} y={y} onClick={clickHandle} onTap={clickHandle}>
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

export default React.memo(Room);
