import { useTranslation } from 'react-i18next';
import { useGetBuildingsQuery } from '@/entities/building';
import { pointNameList } from '@/entities/point';
import { historyIcon } from '@/shared/assets/icons/common';
import { useAppSelector } from '@/shared/lib';
import { selectRecentPoints, type SearchDirection } from '../model/pointSearchSlice';
import { useSelectPoint } from '../model/useSelectPoint';

export function SearchHistory({ direction }: { direction?: SearchDirection } = {}) {
    const points = useAppSelector(selectRecentPoints);
    const select = useSelectPoint();
    const { data: buildings } = useGetBuildingsQuery();
    const { t } = useTranslation();
    if (!points.length) return <p className="history-empty">{t('RecentPlacesHint')}</p>;
    return <ul className="point-list" aria-label={t('RecentPlaces')}>{points.map(point => <li key={point.id}>
        <button type="button" onClick={() => select(point, direction)}>
            <img src={historyIcon} alt="" width="24" height="24" />
            <span><strong>{pointNameList(point).join(', ')}</strong><small>{buildings?.find(b => b.id === point.buildingId)?.displayableName}</small></span>
        </button>
    </li>)}</ul>;
}
