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
    length?: number,
    offset?: number,
    type?: PointTypes,
    buildingId?: string,
    floorId?: string
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
            query: ({ name, length = 40, offset = 0, type, buildingId, floorId }) => type !== undefined ? {
                url: '/api/points',
                // The points endpoint has no offset: fetch the prefix and return this page below.
                params: { type, length: offset + length,
                    ...(buildingId !== undefined ? { buildingId } : {}),
                    ...(floorId !== undefined ? { floorId } : {}) },
                method: 'GET',
            } : ({
                url: '/api/search',
                params: {
                    name,
                    ...(length !== undefined ? { length } : {}),
                    ...(offset !== undefined ? { offset } : {}),
                    ...(type !== undefined ? { type } : {}),
                    ...(buildingId !== undefined ? { buildingId } : {}),
                    ...(floorId !== undefined ? { floorId } : {}),
                },
                method: 'GET',
            }),
            transformResponse: (points: IGraphPoint[] | null, _meta, { type, offset = 0, length = 40 }) =>
                type !== undefined ? (points ?? []).slice(offset, offset + length) : (points ?? []),
        }),
    })
})

export const {
    useGetPointsQuery,
    useGetPointByIdQuery,
    useSearchPointsQuery
} = pointApi
