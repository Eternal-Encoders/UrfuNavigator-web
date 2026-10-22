import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetBuildingsQuery } from '@/entities/building';
import { pointNameList } from '@/entities/point';
import { ListSkeleton } from '@/shared/ui';
import { useSearchResults } from '../model/useSearchResults';
import { useSelectPoint } from '../model/useSelectPoint';

const NEAR_BOTTOM_PX = 80;

function preventPassThrough(e: React.TouchEvent<HTMLUListElement>) {
    e.stopPropagation();
}

function canScroll(element: HTMLElement) {
    const { overflowY } = getComputedStyle(element);
    return overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
}

function scrollParent(element: HTMLElement): HTMLElement {
    let current: HTMLElement | null = element;
    let fallback: HTMLElement | null = null;
    while (current) {
        if (canScroll(current)) {
            if (!fallback) {
                fallback = current;
            }
            if (current.scrollHeight > current.clientHeight + 1) {
                return current;
            }
        }
        current = current.parentElement;
    }
    return fallback ?? element;
}

export function SearchResults() {
    const { points, isFetchingNext, loadMore, isLoading, isError } = useSearchResults();
    const selectPoint = useSelectPoint();
    const { data: buildings } = useGetBuildingsQuery();
    const { t } = useTranslation();
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        const list = listRef.current;
        if (!list) {
            return;
        }
        const scroller = scrollParent(list);
        function onScroll() {
            const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
            if (remaining <= NEAR_BOTTOM_PX) {
                loadMore();
            }
        }
        onScroll();
        scroller.addEventListener('scroll', onScroll, { passive: true });
        return () => scroller.removeEventListener('scroll', onScroll);
    }, [loadMore, points]);

    if (isLoading) return <ListSkeleton label={t('Loading')} />;
    if (isError || points?.length === 0) {
        return <p className="navigator-message" role="status">
            {t(isError ? 'SearchLoadError' : 'NoResults')}
        </p>;
    }
    if (!points) {
        return null;
    }

    return (
        <ul
            ref={listRef}
            className="point-list"
            onTouchStart={preventPassThrough}
            onTouchMove={preventPassThrough}
        >
            {points.map((point) => {
                const building = buildings?.find((item) => item.id === point.buildingId);
                return (
                    <li key={point.id}>
                        <button
                            type="button"
                            className="outline-none focus-visible:bg-muted"
                            onClick={() => selectPoint(point)}
                        >
                            <img src="/remake/7b59f.svg" alt="" width="24" height="24" />
                            <span><strong>
                                {pointNameList(point).join(', ')}
                            </strong>
                            <small>
                                {building?.displayableName}
                            </small>
                            </span>
                        </button>
                    </li>
                );
            })}
            {isFetchingNext &&
                <li><ListSkeleton label={t('Loading')} rows={2} /></li>
            }
        </ul>
    );
}
