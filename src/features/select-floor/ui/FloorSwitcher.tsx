import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { sortedFloors } from '@/entities/building';
import { floorSet, selectFloor } from '@/entities/floor';
import { selectRoutePoints } from '@/entities/route';
import type { IFloorSummary } from '@/shared/api';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface FloorSwitcherProps {
    buildingId: string,
    floors: IFloorSummary[]
}

export function FloorSwitcher({ buildingId, floors }: FloorSwitcherProps) {
    const dispatch = useAppDispatch()
    const currentFloor = useAppSelector(selectFloor)
    const points = useAppSelector(selectRoutePoints)
    const { t } = useTranslation();
    const ordered = useMemo(() => sortedFloors(floors).reverse(), [floors]);
    const scroller = useRef<HTMLUListElement>(null);
    const [edges, setEdges] = useState({ above: false, below: ordered.length > 5 });
    const slots = Math.min(5, ordered.length) - Number(edges.above) - Number(edges.below);
    function measure() {
        const list = scroller.current;
        if (!list) return;
        const above = list.scrollTop > 1;
        const below = list.scrollTop + list.clientHeight < list.scrollHeight - 1;
        setEdges(previous => previous.above === above && previous.below === below ? previous : { above, below });
    }
    useLayoutEffect(() => {
        const list = scroller.current;
        if (!list) return;
        const observer = new ResizeObserver(measure);
        observer.observe(list);
        return () => observer.disconnect();
    }, []);
    useLayoutEffect(() => {
        const list = scroller.current;
        if (!list) return;
        const index = ordered.findIndex(floor => floor.id === currentFloor);
        const row = list.children.item(Math.max(0, index)) as HTMLElement | null;
        if (row) list.scrollTop = row.offsetTop - list.offsetTop - 39;
        measure();
    }, [currentFloor, ordered]);
    function scroll(direction: number) {
        scroller.current?.scrollBy({ top: direction * 39 * Math.max(1, slots),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    }

    return (
        <div className="floor-switcher" data-floor-switcher
            style={{ '--floor-visible-rows': Math.max(1, slots) } as CSSProperties}>
            {edges.above && <Button variant="ghost" size="icon-lg" aria-label={t('FloorsAbove')}
                onClick={() => scroll(-1)}>▲</Button>}
            <ul ref={scroller} className="floor-switcher-scroll" onScroll={measure}>
                {ordered.map((floor) => {
                    const isActive = currentFloor === floor.id
                    const onTheWay =
                    (points.from?.floorId === floor.id && points.from.buildingId === buildingId) ||
                    (points.to?.floorId === floor.id && points.to.buildingId === buildingId)

                    return (
                        <li key={floor.id}>
                            <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                size="icon-lg"
                                aria-pressed={isActive}
                                className={cn(
                                    'text-muted-foreground',
                                    onTheWay && 'ring-2 ring-route ring-offset-1 ring-offset-card'
                                )}
                                onClick={() => dispatch(floorSet({ floor: floor.id, priority: 1 }))}
                            >
                                {floor.displayableName}
                            </Button>
                        </li>
                    )
                })}
            </ul>
            {edges.below && <Button variant="ghost" size="icon-lg" aria-label={t('FloorsBelow')}
                onClick={() => scroll(1)}>▼</Button>}
        </div>
    )
}
