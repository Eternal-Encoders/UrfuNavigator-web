import { useTranslation } from 'react-i18next';
import { clearRoute } from '@/entities/route';
import { SearchTrigger } from '@/features/point-search';
import { useAppDispatch } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function RoutePanel() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    return <section className="route-panel">
        <SearchTrigger direction="from" />
        <SearchTrigger direction="to" />
        <p>{t('RouteInstructions')}</p>
        <Button variant="secondary" onClick={() => dispatch(clearRoute())}>{t('ClearRoute')}</Button>
    </section>;
}
