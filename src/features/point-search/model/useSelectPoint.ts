import { useNavigate } from 'react-router-dom';
import { instituteRoute, useGetBuildingsQuery } from '@/entities/building';
import { floorSet } from '@/entities/floor';
import { selectPoint } from '@/entities/point';
import { clearRoute, setFromPoint, setToPoint } from '@/entities/route';
import { SideBarContent, selectContent, selectPrevContent, setContent } from '@/entities/sidebar';
import type { IGraphPoint } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import {
    rememberPoint,
    resetSearchQuery,
    selectSearchDirection,
    setSearchDirection,
    type SearchDirection
} from './pointSearchSlice';

const SEARCH_CONTENT = [SideBarContent.TypeList, SideBarContent.PointsList];

export function useSelectPoint() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data: buildings } = useGetBuildingsQuery();
    const content = useAppSelector(selectContent);
    const prevContent = useAppSelector(selectPrevContent);
    const direction = useAppSelector(selectSearchDirection);

    return (point: IGraphPoint, directionOverride?: SearchDirection) => {
        dispatch(rememberPoint(point));
        const target = directionOverride ?? direction;
        if (directionOverride) {
            dispatch(setSearchDirection(directionOverride));
        }
        if (target === 'browse') {
            dispatch(clearRoute());
            dispatch(selectPoint(point.id));
        } else {
            dispatch(target === 'to' ? setToPoint(point) : setFromPoint(point));
        }
        if (SEARCH_CONTENT.includes(content)) {
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
