import React from 'react';
import { Group, Rect } from 'react-konva';
import { useAppDispatch } from '../../store/hook';
import { PointSet } from '../../features/descMenu/descMenuSlice';

interface AudienceProps {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    stroke?: string,
    fill?: string,
    children?: React.ReactNode[]
}

function Audience({
    id,
    x,
    y,
    width,
    height,
    stroke,
    fill,
    children
}: AudienceProps) {
    const dispatch = useAppDispatch();

    function clickHandle() {
        dispatch(PointSet(id))
    }

    return (
        <Group x={x} y={y} onClick={clickHandle}>
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