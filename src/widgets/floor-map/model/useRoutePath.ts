import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { selectRoutePoints, useGetPathQuery } from '@/entities/route';
import type { IPath } from '@/shared/api';
import { useAppSelector } from '@/shared/lib';

export function useRoutePath() {
    const [path, setPath] = useState<IPath | undefined>(undefined)
    const points = useAppSelector(selectRoutePoints);

    const { data } = useGetPathQuery(
        points.from && points.to
            ? { from: points.from.id, to: points.to.id }
            : skipToken
    );

    useEffect(() => {
        if (data) {
            setPath(data.result)
        }
    }, [data])

    return path
}
