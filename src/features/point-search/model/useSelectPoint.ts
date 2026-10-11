import { useNavigate } from 'react-router-dom';
import { instituteRoute, useGetBuildingsQuery } from '@/entities/building';
import { floorSet } from '@/entities/floor';
import { setFromPoint, setToPoint } from '@/entities/route';
import { selectPrevContent, setContent } from '@/entities/sidebar';
import type { IGraphPoint } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { resetSearchQuery, selectSearchDirection } from './pointSearchSlice';

export function useSelectPoint() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data: buildings } = useGetBuildingsQuery();
    const prevContent = useAppSelector(selectPrevContent);
    const direction = useAppSelector(selectSearchDirection);

    return (point: IGraphPoint) => {
        dispatch(direction === 'to' ? setToPoint(point) : setFromPoint(point));
        dispatch(setContent(prevContent));
        dispatch(resetSearchQuery());
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
