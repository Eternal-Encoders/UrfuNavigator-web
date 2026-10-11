import { baseApi, type IBuilding } from '@/shared/api';

export const buildingApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getBuildings: build.query<IBuilding[], void>({
            query: () => ({
                url: '/api/buildings',
                method: 'GET'
            }),
        }),
        getBuilding: build.query<IBuilding, string>({
            query: (id) => ({
                url: '/api/building',
                params: { id },
                method: 'GET',
            })
        }),
    })
})

export const {
    useGetBuildingsQuery,
    useGetBuildingQuery
} = buildingApi
