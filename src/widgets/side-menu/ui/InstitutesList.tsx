import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuildingCardMorph } from '../model/useBuildingCardMorph';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { setCampusOpen } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector, useCarouselEndPull } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';
import { BuildingLink, buildingPhoto, useGetBuildingsQuery } from '@/entities/building';

export function InstitutesList({ progress: mobileProgress = 0 }: { progress?: number }) {
    const dispatch = useAppDispatch();
    const openCampuses = () => dispatch(setCampusOpen(true));
    const isDesktop = useAppSelector(selectScreenSize).innerWidth > PHONE_BREAKPOINT;
    const progress = isDesktop ? 1 : mobileProgress;
    const { data: buildings = [], isLoading, isError, refetch } = useGetBuildingsQuery();
    const { t } = useTranslation();
    const listRef = useBuildingCardMorph(progress, buildings.length + 1);
    const { progress: pullProgress } = useCarouselEndPull(
        !isDesktop && progress === 0 && !isLoading, openCampuses, listRef
    );
    if (isLoading) return <div className={`building-loading ${progress > 0.5 ? 'is-expanded' : ''}`}
        role="status" aria-label={t('Loading')} aria-busy="true">
        {[0, 1, 2, 3].map(n => <div className="building-loading-card" key={n}>
            <Skeleton className="h-25 w-full shrink-0 rounded-none" />
            <Skeleton className="mx-4 h-2 w-12" />
        </div>)}
    </div>;
    if (isError) return <div className="navigator-message" role="alert"><p>{t('BuildingsLoadError')}</p><button type="button" onClick={() => refetch()}>{t('Retry')}</button></div>;
    const sorted = [...buildings].sort((a, b) =>
        (buildingPhoto(a.displayableName)?.order ?? 99) - (buildingPhoto(b.displayableName)?.order ?? 99));
    return <ul ref={listRef} className="building-list campus-morph campus-picker-list" style={{
        '--campus-progress': progress, '--card-count': buildings.length + 1,
        '--details-visibility': progress > 0.38 ? 'visible' : 'hidden',
        '--category-pull-progress': pullProgress,
        '--category-pull-offset': `${-32 * pullProgress / (pullProgress + 0.5)}px`,
        overflowX: progress > 0 ? 'visible' : undefined, overflowY: progress > 0 ? 'visible' : undefined
    } as CSSProperties}>
        {sorted.map((building, index) => <li key={building.id} data-building-id={building.id}
            style={{ '--card-index': index } as CSSProperties}><BuildingLink building={building} /></li>)}
        <li data-building-id="campus-picker" style={{ '--card-index': sorted.length } as CSSProperties}>
            <button type="button" className="all-category-button campus-picker-button" onClick={openCampuses}>
                <span className="category-pull-indicator">
                    <svg className="category-pull-ring" viewBox="0 0 44 44" aria-hidden="true">
                        <circle cx="22" cy="22" r="20" pathLength="1" />
                    </svg>
                    <img src="/remake/28769.svg" alt="" width="20" height="20" />
                </span>
                {t('SelectCampus')}
            </button>
        </li>
    </ul>;
}
