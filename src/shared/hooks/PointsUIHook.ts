import { skipToken } from '@reduxjs/toolkit/query';
import { useGetPointsByTypeQuery, useSearchPointsQuery } from '../../features/api/apiSlice';
import { IGraphPoint, PointTypes } from '../../utils/interfaces';


export function usePointsUIListHook(name: string | undefined, type: PointTypes | undefined) {
    const { data: pointsByType } = useGetPointsByTypeQuery(type ? { type } : skipToken);
    const { data: pointsByName } = useSearchPointsQuery(
        type
            ? skipToken
            : {
                name: name ?? '',
                length: 40
            }
    );
    const res: IGraphPoint[] | undefined = type ? pointsByType : pointsByName;

    return res;
};