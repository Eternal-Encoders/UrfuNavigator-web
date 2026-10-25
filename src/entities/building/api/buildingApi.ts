import { baseApi, type IIconUrl, type IBuilding } from '@/shared/api';

export const buildingApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getBuildings: build.query<IBuilding[], void>({
            query: () => ({
                url: '/api/buildings',
                method: 'GET'
            }),
        }),
        getBuildingIcon: build.query<IIconUrl, string>({
            query: name => ({ url: `/api/icons/${encodeURIComponent(name)}`, method: 'GET' })
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
    useGetBuildingIconQuery,
    useGetBuildingsQuery,
    useGetBuildingQuery
} = buildingApi
