import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { useGetIconQuery } from '@/entities/floor';
import placeholderIcon from '@/shared/assets/icons/map/placeholder.svg';

interface RoomIconProps {
    icon: string,
    x: number,
    y: number,
    width?: number,
    height?: number
}

function RoomIcon({ icon, x, y, width, height }: RoomIconProps) {
    const filename = icon.endsWith('.svg') ? icon : `${icon}.svg`;
    const { data } = useGetIconQuery(filename);
    const [image] = useImage(data?.url || placeholderIcon);
    return (
        <Image
            image={image}
            x={x}
            y={y}
            width={width}
            height={height}
            listening={false}
        />
    )
}

export default React.memo(RoomIcon);
