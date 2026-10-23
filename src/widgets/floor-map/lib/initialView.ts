import { PointTypes, type IGraphPoint } from '@/shared/api';

export function initialMapAnchor(width: number, height: number, firstFloor: boolean,
    entrances: IGraphPoint[] = [], fallback = { x: width / 2, y: height / 2 }) {
    const valid = firstFloor ? entrances.filter(point => point.types.includes(PointTypes.Exit)
        && Number.isFinite(point.x) && Number.isFinite(point.y)
        && point.x >= 0 && point.y >= 0 && point.x <= width && point.y <= height) : [];
    const main = (point: IGraphPoint) => /главн.{0,12}вход|main entrance/i.test(
        [point.displayableName, ...point.names.map(name => name.name)].join(' '));
    valid.sort((a, b) => Number(main(b)) - Number(main(a)) || a.id.localeCompare(b.id));
    return valid.length ? { x: valid[0].x, y: valid[0].y } : fallback;
}
