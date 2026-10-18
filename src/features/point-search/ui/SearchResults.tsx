import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { buildingAccent, useGetBuildingsQuery } from '@/entities/building';
import { pointNameList } from '@/entities/point';
import { useSearchResults } from '../model/useSearchResults';
import { useSelectPoint } from '../model/useSelectPoint';

const NEAR_BOTTOM_PX = 80;

function preventPassThrough(e: React.TouchEvent<HTMLUListElement>) {
    e.preventDefault();
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
    const { points, isFetchingNext, loadMore } = useSearchResults();
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

    if (!points) {
        return null;
    }

    return (
        <ul
            ref={listRef}
            className="size-full overflow-auto px-5"
            onTouchStart={preventPassThrough}
            onTouchMove={preventPassThrough}
        >
            {points.map((point) => {
                const building = buildings?.find((item) => item.id === point.buildingId);
                return (
                    <li key={point.id}>
                        <button
                            type="button"
                            className="flex w-full flex-col gap-0.5 border-b py-2 text-left outline-none hover:bg-muted/60 focus-visible:bg-muted"
                            onClick={() => selectPoint(point)}
                        >
                            <span className="text-sm font-medium text-foreground">
                                {pointNameList(point).join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: buildingAccent(building) }}
                                />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {building?.displayableName}
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
            {isFetchingNext &&
                <li className="py-2 text-center text-xs font-medium text-muted-foreground">
                    {t('Loading')}
                </li>
            }
        </ul>
    );
}
