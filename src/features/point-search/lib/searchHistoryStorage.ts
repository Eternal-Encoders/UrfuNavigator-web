import type { IGraphPoint } from '@/shared/api';

const KEY = 'navigator.recent-points';

function isHistoryPoint(value: unknown): value is IGraphPoint {
    if (!value || typeof value !== 'object') return false;
    const point = value as Partial<IGraphPoint>;
    return typeof point.id === 'string' && typeof point.buildingId === 'string'
        && typeof point.floorId === 'string' && Array.isArray(point.names);
}

export function readSearchHistory(): IGraphPoint[] {
    try {
        const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
        return Array.isArray(value) ? value.filter(isHistoryPoint).slice(0, 5) : [];
    } catch {
        return [];
    }
}

export function writeSearchHistory(points: IGraphPoint[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(points));
    } catch { /* Navigation still works when browser storage is unavailable. */ }
}
