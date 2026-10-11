import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib';
import { useGetBuildingsQuery } from '../api/buildingApi';
import { buildingAccent, instituteRoute } from '../lib/building';

interface BuildingRedirectProps {
    buildingId: string,
    currentBuildingId: string
}

const nameClass = 'm-0 w-full text-center text-sm leading-10 font-medium';

export function BuildingRedirect({ buildingId, currentBuildingId }: BuildingRedirectProps) {
    const { data } = useGetBuildingsQuery();
    const building = data?.find((item) => item.id === buildingId);
    const current = data?.find((item) => item.id === currentBuildingId);
    const isCurrent = buildingId === currentBuildingId;

    if (!isCurrent && building) {
        return (
            <Link
                to={instituteRoute(building)}
                className="flex-1 rounded-lg bg-secondary transition-colors hover:bg-accent"
            >
                <h1 className={cn(nameClass, 'text-muted-foreground')}>{building.displayableName}</h1>
            </Link>
        );
    }

    return (
        <div
            className="flex-1 rounded-lg bg-secondary"
            style={isCurrent ? { background: buildingAccent(current) } : undefined}
        >
            <h1 className={cn(nameClass, 'text-white')}>{building?.displayableName ?? ''}</h1>
        </div>
    );
}
