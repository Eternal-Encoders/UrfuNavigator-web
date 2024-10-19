import { useGetPathQuery } from '../../../features/api/apiSlice';
import { selectFloor } from '../../../features/floor/floorSlice'
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice'
import { useAppSelector } from '../../../store/hook'
import { IPath } from '../../../utils/interfaces';

export function usePathMap() {
    const points = useAppSelector(selectSearchPoints);
    const currentFloor = useAppSelector(selectFloor);

    let path: IPath | undefined = undefined

    if (points.from && points.to) {
        const { data } = useGetPathQuery({
            from: points.from.id,
            to: points.to.id
        });
        path = data;
    }


    return {
        path,
        currentFloor
    }
};