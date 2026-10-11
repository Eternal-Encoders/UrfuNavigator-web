import type { IBuilding, IFloorSummary } from '@/shared/api';

export const DEFAULT_BUILDING_ACCENT = '#CCCCCC';

export function instituteRoute(building: Pick<IBuilding, 'id' | 'url'>): string {
    const slug = building.url.replace(/^\/+/, '');
    return `/institute/${slug || building.id}`;
}

export function matchBuilding(buildings: IBuilding[], slug: string): IBuilding | undefined {
    return buildings.find((building) => {
        const urlSlug = building.url.replace(/^\/+/, '');
        return urlSlug === slug || building.id === slug;
    });
}

export function buildingAccent(building: IBuilding | undefined): string {
    return building?.colorSchemes?.[0]?.accentColor || DEFAULT_BUILDING_ACCENT;
}

export function sortedFloors(floors: IFloorSummary[]): IFloorSummary[] {
    return [...floors].sort((a, b) => {
        const aNumber = Number(a.displayableName);
        const bNumber = Number(b.displayableName);
        const aNumeric = a.displayableName.trim() !== '' && Number.isFinite(aNumber);
        const bNumeric = b.displayableName.trim() !== '' && Number.isFinite(bNumber);
        if (aNumeric && bNumeric) {
            return aNumber - bNumber;
        }
        return a.displayableName.localeCompare(b.displayableName, 'ru', { numeric: true });
    });
}
