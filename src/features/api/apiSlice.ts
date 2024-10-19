import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IGraphPoint, IInstitute, IMapObject, IPath, PointTypes } from "../../utils/interfaces";

const urlOrigin = import.meta.env.VITE_HOST ? `https://${import.meta.env.VITE_HOST}` : 'https://dev.how-to-navigate.ru/api'

interface IFloorReq {
    inst: string,
    floor: number
}

interface IByTypeReq {
  type: PointTypes, 
  institute?: string, 
  floor?: number
}

interface IByNameReq {
  name: string, 
  length: number
}

interface IPathReq {
    from: string,
    to: string
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: urlOrigin,
    }),
    endpoints: build => ({
        getFloor: build.query<IMapObject, IFloorReq>({
            query: ({inst, floor}) => ({
                url: '/floor',
                method: 'GET',
                params: {
                    floor: floor,
                    institute: inst
                }
            }),
        }),
        getInstituteByUrl: build.query<IInstitute, string>({
            query: (url) => ({
                url: '/institute',
                params: {
                    institute: url
                },
                method: 'GET',
            })
        }),
        getInstitutes: build.query<IInstitute[], undefined>({
            query: () => ({
                url: '/institutes',
                method: 'GET'
            }),
        }),
        getPointsByType: build.query<IGraphPoint[], IByTypeReq>({
            query: ({ type, institute, floor }) => ({
                url: '/points',
                params: {
                    type: type,
                    institute: institute,
                    floor: floor
                },
                method: 'GET',
            })
        }),
        getPointsByName: build.query<IGraphPoint[], IByNameReq>({
          query: ({ name, length }) => ({
              url: '/points',
              params: {
                name: name,
                length: length
              },
              method: 'GET',
          })
        }),
        getPointById: build.query<IGraphPoint, string>({
          query: (id) => ({
              url: '/point',
              params: {
                id: id
              },
              method: 'GET',
          })
        }),
        getPath: build.query<IPath, IPathReq>({
            query: ({ from, to }) => ({
                url: '/path',
                params: {
                    from: from,
                    to: to
                },
                method: 'GET'
            })
        }),
        searchPoints: build.query<IGraphPoint[], IByNameReq>({
            query: ({ name, length }) => ({
                url: '/search',
                params: {
                    name: name,
                    length: length
                  },
                method: 'GET',
            })
        })
    })
})

export const { 
    useGetFloorQuery,
    useGetInstituteByUrlQuery,
    useGetInstitutesQuery,
    useGetPointsByTypeQuery,
    useGetPointsByNameQuery,
    useGetPointByIdQuery,
    useGetPathQuery,
    useSearchPointsQuery
 } = apiSlice