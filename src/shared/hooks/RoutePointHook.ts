import { useCallback } from 'react';
import { useGetPointByIdQuery } from '../../features/api/apiSlice';
import { IGraphPoint } from '../../utils/interfaces';

export function useRoutePoint(id: string) {
    const { data } = useGetPointByIdQuery(id);

    const getRotation = useCallback((point: IGraphPoint) => {
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

    return {
        getRotation
    }
}