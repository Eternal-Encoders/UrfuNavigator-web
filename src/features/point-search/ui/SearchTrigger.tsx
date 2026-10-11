import { useTranslation } from 'react-i18next';
import { buildingAccent, DEFAULT_BUILDING_ACCENT, useGetBuildingsQuery } from '@/entities/building';
import { pointNameList } from '@/entities/point';
import { selectRoutePoints } from '@/entities/route';
import { SideBarContent, setContent } from '@/entities/sidebar';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { setSearchDirection, type SearchDirection } from '../model/pointSearchSlice';

interface SearchTriggerProps {
    direction: SearchDirection,
    isHomePage?: boolean
}

export function SearchTrigger({ direction, isHomePage }: SearchTriggerProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const points = useAppSelector(selectRoutePoints);
    const { data: buildings } = useGetBuildingsQuery();

    const currentPoint = direction === 'to' ? points.to : points.from;
    const building = buildings?.find((item) => item.id === currentPoint?.buildingId);
    const color = currentPoint ? buildingAccent(building) : DEFAULT_BUILDING_ACCENT;

    let placeholder = t('From');
    if (isHomePage) {
        placeholder = t('SearchForAudiencesAndPlaces');
    } else if (direction === 'to') {
        placeholder = t('To');
    }

    function onClickHandler() {
        dispatch(setSearchDirection(direction));
        dispatch(setContent(SideBarContent.TypeList));
    }

    return (
        <button
            type="button"
            onClick={onClickHandler}
            className={cn(
                'flex h-10 min-w-0 flex-1 cursor-text items-center gap-1.5 rounded-md border bg-secondary px-3',
                'text-left font-medium outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50'
            )}
        >
            {!isHomePage &&
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            }
            <span className={cn('truncate', currentPoint ? 'text-foreground' : 'text-subtle-foreground')}>
                {currentPoint ? pointNameList(currentPoint).join(', ') : placeholder}
            </span>
        </button>
    );
}
