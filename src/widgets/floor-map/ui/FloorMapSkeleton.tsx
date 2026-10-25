import { useTranslation } from 'react-i18next';
import { MapSkeleton } from '@/shared/ui';

export function FloorMapSkeleton() {
    const { t } = useTranslation();
    return <MapSkeleton label={t('Loading')} />;
}
