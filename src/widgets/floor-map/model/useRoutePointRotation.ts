import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback } from 'react';
import { useGetPointByIdQuery } from '@/entities/point';
import type { IGraphPoint } from '@/shared/api';

export function useRoutePointRotation(linkedPointId: string | undefined) {
    const { data } = useGetPointByIdQuery(linkedPointId ? linkedPointId : skipToken);

    return useCallback((point: IGraphPoint) => {
        let rotation = 0
        if (data) {
            const xDif = point.x - data.x;
            const yDif = point.y - data.y;
            if (xDif === 0){
                rotation =  yDif > 0 ? 90 : 270
            } else {
                rotation = xDif > 0 ? 0 : 180
            }
        }

        return rotation
    }, [data])
}
