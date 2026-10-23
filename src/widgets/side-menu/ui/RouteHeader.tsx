import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { clearRoute } from '@/entities/route';
import { setRouteDocked, setRouteOpen } from '@/entities/sidebar';
import { RouteSearchField } from '@/features/point-search';
import { useAppDispatch } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function RouteHeader({ compact = false }: { compact?: boolean }) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    return <>
        <div className="route-fields">
            <RouteSearchField direction="from" /><RouteSearchField direction="to" />
        </div>
        {compact && <Button variant="secondary" size="icon-lg" aria-label={t('Back')} onClick={() => {
            dispatch(clearRoute()); dispatch(setRouteDocked(false)); dispatch(setRouteOpen(false));
        }}><ArrowLeft width="20" height="20" /></Button>}
    </>;
}
