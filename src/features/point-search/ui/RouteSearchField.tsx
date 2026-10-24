import { useTranslation } from 'react-i18next';
import { pointTitle } from '@/entities/point';
import { clearRouteEndpoint, selectRoutePoints } from '@/entities/route';
import { finishRouteSearch, selectPanelState, setContent, setContentNoHistory, SideBarContent } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { closeIcon } from '@/shared/assets/icons/common';
import { Input } from '@/shared/ui';
import { selectActiveSearchQuery, selectSearchDirection, setSearchDirection, setSearchName,
    resetSearchQuery, type SearchDirection } from '../model/pointSearchSlice';

export function RouteSearchField({ direction }: { direction: SearchDirection }) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { routeContent } = useAppSelector(selectPanelState);
    const active = useAppSelector(selectSearchDirection);
    const { name } = useAppSelector(selectActiveSearchQuery);
    const point = useAppSelector(selectRoutePoints)[direction];
    const searching = routeContent === SideBarContent.TypeList || routeContent === SideBarContent.PointsList;
    const editing = searching && active === direction;
    function activate() {
        dispatch(setSearchDirection(direction)); dispatch(resetSearchQuery());
        dispatch(setContent(SideBarContent.TypeList));
    }
    const label = t(direction === 'from' ? 'RouteFrom' : 'To');
    return <div className="navigator-input route-search-field">
        {editing ? <span className="small-input-frame">
            <Input key={direction} type="search" inputMode="search" enterKeyHint="search"
                name={`room-query-${direction}`} autoCapitalize="none" autoCorrect="off" spellCheck={false}
                className="small-input [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none"
                value={name} autoFocus aria-label={label} placeholder={label}
                onKeyDown={event => { if (event.key === 'Escape') {
                    event.preventDefault(); event.stopPropagation(); dispatch(finishRouteSearch());
                } }}
                onChange={event => {
                    dispatch(setSearchName(event.currentTarget.value));
                    dispatch(setContentNoHistory(event.currentTarget.value
                        ? SideBarContent.PointsList : SideBarContent.TypeList));
                }} />
        </span> : <button type="button" className={`route-field-value ${point ? '' : 'is-placeholder'}`}
            aria-label={label} onClick={activate}>{point ? pointTitle(point) : label}</button>}
        {(editing ? Boolean(name) : Boolean(point)) && <button type="button" className="route-field-clear" aria-label={`${t('ClearSearch')}: ${label}`}
            onClick={() => {
                activate(); dispatch(clearRouteEndpoint(direction));
            }}><img src={closeIcon} width="20" height="20" alt="" /></button>}
    </div>;
}
