import { Link } from 'react-router-dom';
import type { IBuilding } from '@/shared/api';
import { instituteRoute } from '../lib/building';
import { buildingPhoto } from '../lib/buildingPhoto';
import { BuildingPhotoImage } from './BuildingPhotoImage';

export function BuildingLink({ building }: { building: IBuilding }) {
    const photo = buildingPhoto(building.displayableName);
    return <Link to={instituteRoute(building)} className="building-card">
        <div className="building-photo building-icon"><BuildingPhotoImage
            key={building.icon?.url}
            src={building.icon?.url ?? ''} alt={building.displayableName} eager={(photo?.order ?? 99) < 2} /></div>
        <div className="building-card-info">
            <span className="building-card-title" title={building.displayableName}>
                {photo?.label ?? building.displayableName}
            </span>
            <div className="building-card-extra">
                <span>{photo?.fullName ?? building.displayableName}</span>
                {photo?.address && <span>{photo.address}</span>}
            </div>
        </div>
    </Link>;
}
