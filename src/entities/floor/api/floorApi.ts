import { baseApi, type IFloor, type IIconUrl } from '@/shared/api';

export const floorApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getFloor: build.query<IFloor, string>({
            query: (id) => ({
                url: '/api/floor',
                params: { id },
                method: 'GET',
            }),
        }),
        getIcon: build.query<IIconUrl, string>({
            query: (icon) => ({
                url: `/api/icons/${encodeURIComponent(icon)}`,
                method: 'GET',
            })
        })
    })
})

export const {
    useGetFloorQuery,
    useGetIconQuery
} = floorApi
