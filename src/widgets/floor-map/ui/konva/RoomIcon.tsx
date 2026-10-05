import React from 'react';
import { Image } from 'react-konva';
import useImage from 'use-image';
import { floorIconSrc } from '@/shared/assets/icons/floor';
import placeholderIcon from '@/shared/assets/icons/map/placeholder.svg';

interface RoomIconProps {
    icon: string,
    x: number,
    y: number,
    width?: number,
    height?: number
}

function RoomIcon({ icon, x, y, width, height }: RoomIconProps) {
    const [image] = useImage(floorIconSrc(icon) ?? placeholderIcon);

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
