import { useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useBuildingCardMorph } from '../model/useBuildingCardMorph';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { setCampusOpen } from '@/entities/sidebar';
import { selectCampusState } from '@/entities/campus';
import { useAppDispatch, useAppSelector, useCarouselEndPull } from '@/shared/lib';
import { Skeleton } from '@/shared/ui';
import { BuildingCard, BuildingLink, buildingPhoto, readBuildingVisits, useGetBuildingsQuery } from '@/entities/building';

export function InstitutesList({ progress: mobileProgress = 0 }: { progress?: number }) {
    const dispatch = useAppDispatch();
    const [visits] = useState(readBuildingVisits);
    const openCampuses = () => dispatch(setCampusOpen(true));
    const isDesktop = useAppSelector(selectScreenSize).innerWidth > PHONE_BREAKPOINT;
    const progress = isDesktop ? 1 : mobileProgress;
    const { data: allBuildings = [], isLoading, isError, refetch } = useGetBuildingsQuery();
    const { selected: campus } = useAppSelector(selectCampusState);
    const buildings = allBuildings.filter(building => {
        const isUgi = building.url.replace(/^\/+/, '') === 'ugi';
        return campus === 'lenina' ? isUgi : campus === 'mira' && !isUgi;
    });
    const { t } = useTranslation();
    const extraCards = campus === 'mira' ? [
        { id: 'fti', title: 'ФТИ', unavailable: true, iconName: 'fti.svg', to: undefined },
        { id: 'hti', title: 'ХТИ', unavailable: false, iconName: 'hti.svg', to: '/institute/inmit-hti' },
        { id: 'info', title: 'ИнФО', unavailable: false, iconName: 'info.svg', to: '/institute/uralenin' }
    ] : [];
    const count = buildings.length + extraCards.length;
    const listRef = useBuildingCardMorph(progress, count + 1);
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
    const sorted = [
        ...buildings.map(building => ({ id: building.id, title: building.displayableName, building })),
        ...extraCards.map(card => ({ ...card, building: undefined }))
    ].sort((a, b) => {
        if (a.id === 'fti') return 1;
        if (b.id === 'fti') return -1;
        const key = (card: typeof a) => card.building
            ? card.building.url.replace(/^\/+/, '') || card.building.id
            : ('to' in card ? card.to?.split('/').pop() : undefined);
        const frequency = (visits[key(b) ?? ''] ?? 0) - (visits[key(a) ?? ''] ?? 0);
        return frequency || (buildingPhoto(a.title)?.order ?? 99) - (buildingPhoto(b.title)?.order ?? 99);
    });
    return <ul ref={listRef} className="building-list campus-morph campus-picker-list" style={{
        '--campus-progress': progress, '--card-count': count + 1,
        '--details-visibility': progress > 0.38 ? 'visible' : 'hidden',
        '--category-pull-progress': pullProgress,
        '--category-pull-offset': `${-32 * pullProgress / (pullProgress + 0.5)}px`,
        overflowX: progress > 0 ? 'visible' : undefined, overflowY: progress > 0 ? 'visible' : undefined
    } as CSSProperties}>
        {sorted.map((card, index) => <li key={card.id} data-building-id={card.id}
            style={{ '--card-index': index } as CSSProperties}>
            {card.building ? <BuildingLink building={card.building} /> : <BuildingCard
                title={card.title} expandedTitle={buildingPhoto(card.title)?.expandedTitle}
                fullName={buildingPhoto(card.title)?.fullName} address={buildingPhoto(card.title)?.address}
                iconName={'iconName' in card ? card.iconName : undefined}
                to={'to' in card ? card.to : undefined} unavailable={'unavailable' in card && card.unavailable} />}
        </li>)}
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
