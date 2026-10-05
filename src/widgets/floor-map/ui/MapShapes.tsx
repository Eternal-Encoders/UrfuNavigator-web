import { Circle, Group, Line, Rect } from 'react-konva';
import { selectPoint } from '@/entities/point';
import type { Theme } from '@/entities/viewer';
import type {
    IColorSchema,
    IDoorShape,
    IPolyShape,
    IRectangleShape,
    IRoom,
    IService,
    IShape
} from '@/shared/api';
import { useAppDispatch } from '@/shared/lib';
import { MapPaint, paintForRoom, paintForService } from '../lib/mapColors';
import Room from './konva/Room';
import RoomIcon from './konva/RoomIcon';
import RoomText from './konva/RoomText';

interface Wall {
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

function rectangleWalls(x: number, y: number, width: number, height: number): Wall[] {
    return [
        { x1: x, y1: y, x2: x + width, y2: y },
        { x1: x + width, y1: y, x2: x + width, y2: y + height },
        { x1: x + width, y1: y + height, x2: x, y2: y + height },
        { x1: x, y1: y + height, x2: x, y2: y }
    ];
}

function polyWalls(shape: IPolyShape, originX = 0, originY = 0): Wall[] {
    const points = shape.points ?? [];
    return points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        return {
            x1: originX + point.x,
            y1: originY + point.y,
            x2: originX + next.x,
            y2: originY + next.y
        };
    });
}

function doorWalls(shape: IShape): Wall[] {
    if (shape.type === 'rectangle') {
        return rectangleWalls(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type === 'poly') {
        return polyWalls(shape, shape.x, shape.y);
    }
    if (shape.type === 'container') {
        for (const child of shape.children ?? []) {
            if (child.type === 'rectangle' || child.type === 'poly') {
                return doorWalls(child).map((wall) => ({
                    x1: wall.x1 + shape.x,
                    y1: wall.y1 + shape.y,
                    x2: wall.x2 + shape.x,
                    y2: wall.y2 + shape.y
                }));
            }
        }
    }
    return [];
}

function clipSpan(min: number, max: number, offset: number, length: number): [number, number] | null {
    const start = Math.max(min, Math.min(offset, offset + length));
    const end = Math.min(max, Math.max(offset, offset + length));
    if (end - start < 0.5) {
        return null;
    }
    return [start, end];
}

function localRectangleDoor(shape: IRectangleShape, door: IDoorShape): number[] | null {
    const { x, y, width, height } = shape;
    if (door.wallId === 0 || door.wallId === 2) {
        const span = clipSpan(x, x + width, door.offset, door.length);
        if (!span) {
            return null;
        }
        const localY = door.wallId === 0 ? 0 : height;
        return [span[0] - x, localY, span[1] - x, localY];
    }
    if (door.wallId === 1 || door.wallId === 3) {
        const span = clipSpan(y, y + height, door.offset, door.length);
        if (!span) {
            return null;
        }
        const localX = door.wallId === 1 ? width : 0;
        return [localX, span[0] - y, localX, span[1] - y];
    }
    return null;
}

function renderDoor(door: IDoorShape, host: IShape, stroke: string | undefined, key: string) {
    let points: number[] | null = null;
    if (host.type === 'rectangle') {
        points = localRectangleDoor(host, door);
    } else {
        const wall = doorWalls(host)[door.wallId];
        const origin = shapeOrigin(host);
        if (wall) {
            const horizontal = Math.abs(wall.x2 - wall.x1) >= Math.abs(wall.y2 - wall.y1);
            if (horizontal) {
                const span = clipSpan(
                    Math.min(wall.x1, wall.x2),
                    Math.max(wall.x1, wall.x2),
                    door.offset,
                    door.length
                );
                if (span) {
                    points = [span[0] - origin.x, wall.y1 - origin.y, span[1] - origin.x, wall.y1 - origin.y];
                }
            } else {
                const span = clipSpan(
                    Math.min(wall.y1, wall.y2),
                    Math.max(wall.y1, wall.y2),
                    door.offset,
                    door.length
                );
                if (span) {
                    points = [wall.x1 - origin.x, span[0] - origin.y, wall.x1 - origin.x, span[1] - origin.y];
                }
            }
        }
    }
    if (!points) {
        return null;
    }
    return (
        <Line
            key={key}
            points={points}
            stroke={stroke || '#3A3A3A'}
            strokeWidth={8}
            listening={false}
        />
    );
}

function shapeOrigin(shape: IShape): { x: number, y: number } {
    if (shape.type === 'door') {
        return { x: 0, y: 0 };
    }
    return { x: shape.x, y: shape.y };
}

function renderNestedShape(shape: IShape, key: string, paint: MapPaint, doorHost: IShape) {
    if (shape.type === 'door') {
        return renderDoor(shape, doorHost, paint.stroke, key);
    }
    if (shape.type === 'text') {
        return (
            <RoomText
                key={key}
                x={shape.x}
                y={shape.y}
                text={shape.text}
                alignX={shape.alignX}
                alignY={shape.alignY}
                fill={paint.text}
            />
        );
    }
    if (shape.type === 'icon') {
        return (
            <RoomIcon
                key={key}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                icon={shape.icon}
            />
        );
    }
    if (shape.type === 'point') {
        return (
            <Circle
                key={key}
                x={shape.x}
                y={shape.y}
                radius={8}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 3 : 0}
                listening={false}
            />
        );
    }
    if (shape.type === 'rectangle') {
        return (
            <Rect
                key={key}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 5 : 0}
                listening={false}
            />
        );
    }
    if (shape.type === 'poly') {
        return (
            <Line
                key={key}
                x={shape.x}
                y={shape.y}
                points={(shape.points ?? []).flatMap((point) => [point.x, point.y])}
                closed
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 5 : 0}
                listening={false}
            />
        );
    }
    if (shape.type === 'container') {
        return (
            <Group key={key} x={shape.x} y={shape.y} listening={false}>
                {shape.children?.map((child, index) =>
                    renderNestedShape(child, `${key}-${index}`, paint, shape)
                )}
            </Group>
        );
    }
    return null;
}

function renderRootBody(shape: IShape, paint: MapPaint) {
    if (shape.type === 'rectangle') {
        return (
            <Rect
                width={shape.width}
                height={shape.height}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 5 : 0}
            />
        );
    }
    if (shape.type === 'poly') {
        return (
            <Line
                points={(shape.points ?? []).flatMap((point) => [point.x, point.y])}
                closed
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 5 : 0}
            />
        );
    }
    if (shape.type === 'point') {
        return (
            <Circle
                radius={8}
                fill={paint.fill}
                stroke={paint.stroke}
                strokeWidth={paint.stroke ? 3 : 0}
            />
        );
    }
    if (shape.type === 'text') {
        return (
            <RoomText
                x={0}
                y={0}
                text={shape.text}
                alignX={shape.alignX}
                alignY={shape.alignY}
                fill={paint.text}
            />
        );
    }
    if (shape.type === 'icon') {
        return (
            <RoomIcon
                x={0}
                y={0}
                width={shape.width}
                height={shape.height}
                icon={shape.icon}
            />
        );
    }
    if (shape.type === 'container') {
        return (
            <Group>
                {(paint.fill || paint.stroke) &&
                    <Rect
                        width={shape.width}
                        height={shape.height}
                        fill={paint.fill}
                        stroke={paint.stroke}
                        strokeWidth={paint.stroke ? 5 : 0}
                    />
                }
                {shape.children?.map((child, index) =>
                    renderNestedShape(child, `shape-${index}`, paint, shape)
                )}
            </Group>
        );
    }
    return null;
}

function isRoom(value: IShape | IRoom): value is IRoom {
    return 'shape' in value;
}

interface MapItemProps {
    schemes: IColorSchema[],
    theme: Theme
}

function MapRoom({ room, schemes, theme }: MapItemProps & { room: IRoom }) {
    const dispatch = useAppDispatch();
    const paint = paintForRoom(room, schemes, theme);
    const children = (room.children ?? []).map((child, index) => {
        if (isRoom(child)) {
            return (
                <MapRoom
                    key={child.id}
                    room={child}
                    schemes={schemes}
                    theme={theme}
                />
            );
        }
        return renderNestedShape(child, `${room.id}-child-${index}`, paint, room.shape);
    });

    function openPoint() {
        if (room.pointId) {
            dispatch(selectPoint(room.pointId));
        }
    }

    if (room.shape.type === 'rectangle') {
        return (
            <Room
                id={room.id}
                pointId={room.pointId}
                x={room.shape.x}
                y={room.shape.y}
                width={room.shape.width}
                height={room.shape.height}
                fill={paint.fill}
                stroke={paint.stroke}
            >
                {children}
            </Room>
        );
    }

    const origin = shapeOrigin(room.shape);
    return (
        <Group x={origin.x} y={origin.y} onClick={openPoint} onTap={openPoint}>
            {renderRootBody(room.shape, paint)}
            {children}
        </Group>
    );
}

function MapService({ service, schemes, theme }: MapItemProps & { service: IService }) {
    const paint = paintForService(service, schemes, theme);
    const origin = shapeOrigin(service.shape);
    return (
        <Group x={origin.x} y={origin.y} listening={false}>
            {renderRootBody(service.shape, paint)}
        </Group>
    );
}

function getRooms(rooms: IRoom[], schemes: IColorSchema[], theme: Theme) {
    return rooms.map((room) => (
        <MapRoom key={room.id} room={room} schemes={schemes} theme={theme} />
    ));
}

function getServices(services: IService[], schemes: IColorSchema[], theme: Theme) {
    return services.map((service) => (
        <MapService key={service.id} service={service} schemes={schemes} theme={theme} />
    ));
}

export {
    getRooms,
    getServices
};
