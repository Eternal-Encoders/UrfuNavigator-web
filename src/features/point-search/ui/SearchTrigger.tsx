import { useTranslation } from 'react-i18next';
import { useMatch } from 'react-router-dom';
import { buildingAccent, DEFAULT_BUILDING_ACCENT, matchBuilding, useGetBuildingsQuery } from '@/entities/building';
import { clearSelectedPoint, pointNameList } from '@/entities/point';
import { clearRoute, selectRoutePoints } from '@/entities/route';
import { SideBarContent, setContent } from '@/entities/sidebar';
import { searchIcon } from '@/shared/assets/icons/common';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { resetSearchQuery, setSearchDirection, type SearchDirection } from '../model/pointSearchSlice';

interface SearchTriggerProps {
    direction: SearchDirection,
    isHomePage?: boolean
}

export function SearchTrigger({ direction, isHomePage }: SearchTriggerProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const points = useAppSelector(selectRoutePoints);
    const { data: buildings } = useGetBuildingsQuery();
    const intstName = useMatch('/institute/:intstName')?.params.intstName;
    const viewedBuilding = intstName && buildings ? matchBuilding(buildings, intstName) : undefined;

    const currentPoint = isHomePage ? undefined : direction === 'to' ? points.to : points.from;
    const building = buildings?.find((item) => item.id === currentPoint?.buildingId);
    const color = currentPoint ? buildingAccent(building) : DEFAULT_BUILDING_ACCENT;

    let placeholder = t('From');
    if (isHomePage) {
        placeholder = viewedBuilding
            ? t('SearchInBuilding', { name: viewedBuilding.displayableName.split(' (')[0] })
            : t('SearchForAudiencesAndPlaces');
    } else if (direction === 'to') {
        placeholder = t('To');
    }

    function onClickHandler() {
        if (isHomePage) {
            dispatch(clearRoute());
            dispatch(clearSelectedPoint());
        }
        dispatch(setSearchDirection(isHomePage ? 'browse' : direction));
        dispatch(resetSearchQuery());
        dispatch(setContent(SideBarContent.TypeList));
    }

    return (
        <button
            type="button"
            onClick={onClickHandler}
            className={cn(
                'navigator-input cursor-text text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50'
            )}
        >
            {isHomePage && <img src={searchIcon} alt="" width="24" height="24" />}
            {!isHomePage &&
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
            }
            <span className={cn('truncate', currentPoint ? 'text-foreground' : 'text-subtle-foreground')}>
                {currentPoint ? pointNameList(currentPoint).join(', ') : placeholder}
            </span>
        </button>
    );
}
