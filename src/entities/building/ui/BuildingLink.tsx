import { Link } from 'react-router-dom';
import type { IBuilding } from '@/shared/api';
import { instituteRoute } from '../lib/building';

interface BuildingLinkProps {
    building: IBuilding
}

export function BuildingLink({ building }: BuildingLinkProps) {
    return (
        <Link
            to={instituteRoute(building)}
            className="mb-2.5 flex max-w-20 flex-col items-center gap-1 rounded-md text-center"
        >
            <img
                className="w-full rounded-md shadow-subtle max-[372px]:w-[95%]"
                src={building.icon?.url ?? ''}
                alt={building.displayableName}
            />
            <span className="text-xs font-medium text-muted-foreground max-[372px]:text-[10px]">
                {building.displayableName}
            </span>
        </Link>
    );
}
