import { Group, Line } from 'react-konva';
import { useRoutePath } from '../model/useRoutePath';

interface RouteLayerProps {
    buildingId: string,
    floorId: string
}

export function RouteLayer({ buildingId, floorId }: RouteLayerProps) {
    const path = useRoutePath();
    const segments = path?.[buildingId]?.[floorId];

    if (!segments) {
        return null;
    }

    return (
        <Group>
            {segments.map((segment, index) =>
                <Line
                    key={index}
                    points={segment.flatMap((point) => [point.x, point.y])}
                    stroke="#54B235"
                    strokeWidth={15}
                />
            )}
        </Group>
    );
}
