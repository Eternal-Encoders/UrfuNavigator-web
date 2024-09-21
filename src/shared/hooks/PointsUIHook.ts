import { useGetPointsByTypeQuery, useSearchPointsQuery } from '../../features/api/apiSlice';
import { IGraphPoint, PointTypes } from '../../utils/interfaces';


export function usePointsUIListHook(name: string | undefined, type: PointTypes | undefined) {
    let res: IGraphPoint[] | undefined = undefined;

    if (type) {
        const { data } = useGetPointsByTypeQuery({
            type: type
        });
        res = data;
    } else {
        const { data } = useSearchPointsQuery({
            name: name ? name : '',
            length: 40
        });
        res = data;
    }

    return res;
};