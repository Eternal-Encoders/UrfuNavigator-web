import { useLocation, useNavigate } from 'react-router-dom';
import { instituteRoute, matchBuilding, useGetBuildingsQuery } from '@/entities/building';
import { floorSet, selectFloor } from '@/entities/floor';
import { focusPoint } from '@/entities/point';
import { clearRoute, setFromPoint, setToPoint } from '@/entities/route';
import { SideBarContent, finishRouteSearch, selectContent, selectPanelState, selectPrevContent,
    setContent, setRouteOpen } from '@/entities/sidebar';
import type { IGraphPoint } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import {
    rememberPoint,
    resetSearchQuery,
    selectSearchDirection,
    setSearchDirection,
    type SearchDirection
} from './pointSearchSlice';

import { fillRouteEntrance } from './fillRouteEntrance';

const SEARCH_CONTENT = [SideBarContent.TypeList, SideBarContent.PointsList];

export function useSelectPoint() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { data: buildings } = useGetBuildingsQuery();
    const content = useAppSelector(selectContent);
    const prevContent = useAppSelector(selectPrevContent);
    const { routeOpen, routeDocked, routeContent } = useAppSelector(selectPanelState);
    const routeSearching = (routeOpen || routeDocked) && SEARCH_CONTENT.includes(routeContent);
    const direction = useAppSelector(selectSearchDirection);
    const floor = useAppSelector(selectFloor);

    return (point: IGraphPoint, directionOverride?: SearchDirection) => {
        dispatch(rememberPoint(point));
        const target = directionOverride ?? direction;
        if (directionOverride) {
            dispatch(setSearchDirection(directionOverride));
        }
        if (target === 'browse') {
            dispatch(clearRoute());
            dispatch(focusPoint({ point, animate: floor === point.floorId }));
        } else {
            dispatch(target === 'to' ? setToPoint(point) : setFromPoint(point));
            if (directionOverride) dispatch(setRouteOpen(true));
            const slug = /^\/institute\/([^/]+)\/?$/.exec(pathname)?.[1];
            const source = slug && buildings ? matchBuilding(buildings, slug) : undefined;
            if (target === 'to' && source) void dispatch(fillRouteEntrance(source, point.id));
        }
        if (routeSearching) {
            dispatch(finishRouteSearch());
            dispatch(resetSearchQuery());
        } else if (SEARCH_CONTENT.includes(content)) {
            dispatch(setContent(target === 'browse' ? SideBarContent.Empty : prevContent));
            dispatch(resetSearchQuery());
        }
        dispatch(floorSet({ floor: point.floorId, priority: 1 }));

        const building = buildings?.find((item) => item.id === point.buildingId);
        if (building) {
            const path = instituteRoute(building);
            if (window.location.pathname !== path) {
                navigate(path);
            }
        }
    };
}
