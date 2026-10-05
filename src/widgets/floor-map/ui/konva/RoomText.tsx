import React from 'react';
import { Text } from 'react-konva';
import { selectTheme, Theme } from '@/entities/viewer';
import type { AlignX, AlignY } from '@/shared/api';
import { useAppSelector } from '@/shared/lib';

interface RoomTextProps {
    x: number,
    y: number,
    text: string,
    alignX: AlignX | undefined,
    alignY: AlignY | undefined,
    fill?: string
}

function RoomText({text, x, y, alignX, alignY, fill}: RoomTextProps) {
    const theme = useAppSelector(selectTheme);

    return (
        <Text
            text={text}
            x={x} y={y}
            fontStyle="500"
            fontFamily="Roboto"
            fontSize={24}
            fill={fill || (theme === Theme.Dark ? '#F3F6FC' : '#3A3A3A')}
            align={alignX?.toLowerCase()}
            verticalAlign={alignY?.toLowerCase()}
            listening={false}
        />
    )
}

export default React.memo(RoomText);
