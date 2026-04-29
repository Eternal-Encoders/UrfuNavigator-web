import { skipToken } from '@reduxjs/toolkit/query';
import { useGetPathQuery } from '../../../features/api/apiSlice';
import { selectFloor } from '../../../features/floor/floorSlice'
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice'
import { useAppSelector } from '../../../store/hook'
import { IPath } from '../../../utils/interfaces';
import { useEffect, useState } from 'react';

export function usePathMap() {
    const [path, setPath] = useState<IPath | undefined>(undefined)

    const points = useAppSelector(selectSearchPoints);
    const currentFloor = useAppSelector(selectFloor);

    const { data } = useGetPathQuery(
        points.from && points.to
            ? {
                from: points.from.id,
                to: points.to.id
            }
            : skipToken
    );

    useEffect(() => {
        // console.log(data)
        if (data) {
            setPath(data.result)
        }
    }, [data])

    return {
        path,
        currentFloor
    }
};