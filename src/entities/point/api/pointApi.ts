import { baseApi, type IGraphPoint, type PointTypes } from '@/shared/api';

interface IPointsReq {
    buildingId?: string,
    floorId?: string,
    type?: PointTypes,
    name?: string,
    length?: number
}

interface ISearchReq {
    name: string,
    length?: number
}

export const pointApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getPoints: build.query<IGraphPoint[], IPointsReq>({
            query: (params) => ({
                url: '/api/points',
                params,
                method: 'GET',
            })
        }),
        getPointById: build.query<IGraphPoint, string>({
            query: (id) => ({
                url: '/api/point',
                params: { id },
                method: 'GET',
            })
        }),
        searchPoints: build.query<IGraphPoint[], ISearchReq>({
            query: ({ name, length }) => ({
                url: '/api/search',
                params: { name, length },
                method: 'GET',
            })
        }),
    })
})

export const {
    useGetPointsQuery,
    useGetPointByIdQuery,
    useSearchPointsQuery
} = pointApi
