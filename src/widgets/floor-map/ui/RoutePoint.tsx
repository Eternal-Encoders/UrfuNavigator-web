import { Image } from 'react-konva';
import useImage from 'use-image';
import type { IGraphPoint } from '@/shared/api';
import routePointIcon from '@/shared/assets/icons/map/route-point.svg';
import { useRoutePointRotation } from '../model/useRoutePointRotation';

interface RoutePointProps {
    point: IGraphPoint
}

export function RoutePoint({ point }: RoutePointProps) {
    const [image] = useImage(routePointIcon);
    const getRotation = useRoutePointRotation(point.links?.[0])

    return (
        <Image
            image={image}
            x={point.x}
            y={point.y}
            width={50}
            height={50}
            rotation={getRotation(point)}
            offsetX={25}
            offsetY={25}
        />
    )
}
