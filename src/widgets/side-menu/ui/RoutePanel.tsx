import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { selectFromPoint } from '@/entities/route';
import { selectPanelState, SideBarContent } from '@/entities/sidebar';
import { SearchHistory, SearchResults } from '@/features/point-search';
import { useAppSelector } from '@/shared/lib';
import { ListSkeleton } from '@/shared/ui';

export function RoutePanel() {
    const { t } = useTranslation();
    const { routeContent } = useAppSelector(selectPanelState);
    const from = useAppSelector(selectFromPoint);
    return <section className="route-panel">
        <Suspense fallback={<ListSkeleton label={t('Loading')} />}>
            {routeContent === SideBarContent.PointsList ? <SearchResults /> : <SearchHistory direction={from ? 'to' : 'from'} />}
        </Suspense>
    </section>;
}
