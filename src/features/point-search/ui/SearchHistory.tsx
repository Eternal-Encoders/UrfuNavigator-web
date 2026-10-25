import { useTranslation } from 'react-i18next';
import { useGetBuildingsQuery } from '@/entities/building';
import { pointApi } from '@/entities/point';
import { historyIcon } from '@/shared/assets/icons/common';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { forgetPoint, selectRecentPoints, type SearchDirection } from '../model/pointSearchSlice';
import type { RecentPoint } from '../lib/searchHistoryStorage';
import { useSelectPoint } from '../model/useSelectPoint';

export function SearchHistory({ direction }: { direction?: SearchDirection } = {}) {
    const dispatch = useAppDispatch();
    const points = useAppSelector(selectRecentPoints);
    const select = useSelectPoint();
    const { data: buildings } = useGetBuildingsQuery();
    const { t } = useTranslation();
    async function open(recent: RecentPoint) {
        try {
            const point = await dispatch(pointApi.endpoints.getPointById.initiate(
                recent.id, { subscribe: false })).unwrap();
            select(point, direction);
        } catch {
            dispatch(forgetPoint(recent.id));
        }
    }
    if (!points.length) return <p className="history-empty">{t('RecentPlacesHint')}</p>;
    return <ul className="point-list" aria-label={t('RecentPlaces')}>{points.map(point => <li key={point.id}>
        <button type="button" onClick={() => { void open(point); }}>
            <img src={historyIcon} alt="" width="24" height="24" />
            <span><strong>{point.title}</strong><small>
                {buildings?.find(building => building.id === point.buildingId)?.displayableName}
            </small></span>
        </button>
    </li>)}</ul>;
}
