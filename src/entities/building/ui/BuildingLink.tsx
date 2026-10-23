import type { IBuilding } from '@/shared/api';
import { instituteRoute } from '../lib/building';
import { buildingPhoto } from '../lib/buildingPhoto';
import { BuildingCard } from './BuildingCard';

export function BuildingLink({ building }: { building: IBuilding }) {
    const photo = buildingPhoto(building.displayableName);
    return <BuildingCard to={instituteRoute(building)} title={photo?.label ?? building.displayableName}
        expandedTitle={photo?.expandedTitle} fullName={photo?.fullName ?? building.displayableName}
        address={photo?.address} iconUrl={building.icon?.url} eager={(photo?.order ?? 99) < 2} />;
}
