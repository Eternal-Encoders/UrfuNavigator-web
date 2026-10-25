import type { UserGPS } from '@/shared/lib';

export function mapNorth(predict: ((loc: UserGPS) => { x: number, y: number }) | null,
    latitude: number, longitude: number, altitude: number): number | null {
    if (!predict || ![latitude, longitude, altitude].every(Number.isFinite)) return null;
    const loc = { latitude, longitude, altitude, heading: 0 };
    const origin = predict(loc), north = predict({ ...loc, latitude: latitude + 0.00001 });
    const dx = north.x - origin.x, dy = north.y - origin.y;
    if (![dx, dy].every(Number.isFinite) || Math.hypot(dx, dy) < 0.000001) return null;
    return Math.atan2(dx, -dy) * 180 / Math.PI;
}
