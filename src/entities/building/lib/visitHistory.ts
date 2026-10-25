export const BUILDING_VISITS_KEY = 'navigator.building-visits.v1';
export type BuildingVisits = Record<string, number>;

export function readBuildingVisits(): BuildingVisits {
    try {
        const stored: unknown = JSON.parse(localStorage.getItem(BUILDING_VISITS_KEY) ?? 'null');
        if (!stored || typeof stored !== 'object' || !('version' in stored) || stored.version !== 1
            || !('counts' in stored) || !stored.counts || typeof stored.counts !== 'object') return {};
        return Object.fromEntries(Object.entries(stored.counts).filter(([key, count]) =>
            /^[a-z0-9_-]{1,100}$/i.test(key) && !['__proto__', 'constructor', 'prototype'].includes(key)
            && Number.isSafeInteger(count) && count > 0));
    } catch { return {}; }
}

export function recordBuildingVisit(key: string) {
    const counts = readBuildingVisits();
    counts[key] = Math.min(Number.MAX_SAFE_INTEGER, (counts[key] ?? 0) + 1);
    try { localStorage.setItem(BUILDING_VISITS_KEY, JSON.stringify({ version: 1, counts })); }
    catch { /* Storage availability must not affect navigation. */ }
}

/** One entry per uninterrupted stay in a building; home permits another visit. */
export function createBuildingVisitTracker(record = recordBuildingVisit) {
    let previous: string | undefined;
    return (key?: string) => {
        if (key === previous) return;
        previous = key;
        if (key) record(key);
    };
}
