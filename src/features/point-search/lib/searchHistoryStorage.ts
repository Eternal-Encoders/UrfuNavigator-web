export interface RecentPoint {
    id: string,
    buildingId: string,
    title: string
}

const KEY = 'navigator.recent-points';

function text(value: unknown) {
    return typeof value === 'string' ? value : '';
}

function legacyTitle(value: Record<string, unknown>) {
    if (!Array.isArray(value.names)) return text(value.displayableName);
    for (const item of value.names) {
        if (item && typeof item === 'object' && 'name' in item) {
            const name = text(item.name);
            if (name) return name;
        }
    }
    return text(value.displayableName);
}

function recentPoint(value: unknown): RecentPoint | undefined {
    if (!value || typeof value !== 'object') return undefined;
    const point = value as Record<string, unknown>;
    const id = text(point.id);
    const buildingId = text(point.buildingId);
    if (!id || !buildingId) return undefined;
    const title = text(point.title) || legacyTitle(point);
    return { id, buildingId, title };
}

export function readSearchHistory(): RecentPoint[] {
    try {
        const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
        if (!Array.isArray(value)) return [];
        return value.map(recentPoint).filter(point => point !== undefined).slice(0, 5);
    } catch {
        return [];
    }
}

export function writeSearchHistory(points: RecentPoint[]) {
    try {
        localStorage.setItem(KEY, JSON.stringify(points));
    } catch { /* Navigation still works when browser storage is unavailable. */ }
}
