import { skipToken } from '@reduxjs/toolkit/query';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetBuildingIconQuery } from '../api/buildingApi';
import { BuildingPhotoImage } from './BuildingPhotoImage';

interface BuildingCardProps {
    title: string, expandedTitle?: string, fullName?: string, address?: string,
    iconUrl?: string, iconName?: string, to?: string, unavailable?: boolean, eager?: boolean
}
export function BuildingCard({ title, expandedTitle = title, fullName, address,
    iconUrl, iconName, to, unavailable = false, eager = false }: BuildingCardProps) {
    const { t } = useTranslation();
    const { data: icon } = useGetBuildingIconQuery(iconName ?? skipToken);
    const src = icon?.url ?? iconUrl ?? '';
    const content = <>
        <div className="building-photo building-icon"><BuildingPhotoImage
            key={src} src={src} alt="" eager={eager} /></div>
        <div className="building-card-info">
            <span className="building-card-title" title={expandedTitle} aria-label={expandedTitle}>
                <span className="building-title-compact" aria-hidden="true">{title}</span>
                <span className="building-title-expanded" aria-hidden="true">{expandedTitle}</span>
            </span>
            <div className="building-card-extra">
                {fullName && <span>{fullName}</span>}
                {unavailable ? <span>{t('CampusUnavailable')}</span> : address && <span>{address}</span>}
            </div>
        </div>
    </>;
    return unavailable || !to
        ? <button type="button" className="building-card is-unavailable" disabled>{content}</button>
        : <Link to={to} className="building-card">{content}</Link>;
}
