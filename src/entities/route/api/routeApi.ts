import { baseApi, type IPathRes } from '@/shared/api';

interface IPathReq {
    from: string,
    to: string
}

export const routeApi = baseApi.injectEndpoints({
    endpoints: build => ({
        getPath: build.query<IPathRes, IPathReq>({
            query: ({ from, to }) => ({
                url: '/api/path',
                params: { from, to },
                method: 'GET'
            })
        }),
    })
})

export const { useGetPathQuery } = routeApi
