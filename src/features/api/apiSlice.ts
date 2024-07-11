import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { IAuditorium, IGraphPoint, IInstituteIcon, IService, PointTypes } from "../../utils/interfaces";

const urlOrigin = import.meta.env.VITE_BACKEND_ORIGIN ? import.meta.env.VITE_BACKEND_ORIGIN : 'https://how-to-navigate.ru:2083'

interface IFloor {
    width: number, 
    height:number, 
    audiences: IAuditorium[], 
    service: IService[]
}
interface IFloorReq {
    inst: string,
    floor: number
}

interface IGraph {
    [id: string]: IGraphPoint
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

const floorQuery = (institute: string, floor: number) => `
query {
    Floors(where: { institute: { equals: "${institute}" }, floor: { equals: ${floor} } }) {
        docs {
            width
            height
            audiences,
            service
        }
    }
}
`

const instituteUrlQuery = (url: string) => `
query {
    Insitutes(where: { url: { equals: "${url}" } }) {
      docs {
        name
        displayableName
        minFloor
        maxFloor
        url
        icon {
          url
          alt
          filename
          mimeType
          filesize
        }
      }
    }
  }
`

const institutesQuery = (page: number | undefined) => `
query {
    Insitutes(page: ${page ? page: 1}) {
      docs {
        name
        displayableName
        minFloor
        maxFloor
        url
        latitude
        longitude
        icon {
          url
          alt
          filename
          mimeType
          filesize
        }
      }
    }
  }
`

const graphQuery = (institute: string, floor: number) => `
query {
    Floors (where: { institute: {equals:"${institute}"}, floor: {equals:${floor}} }) {
      docs {
        graph {
          id 
          x
          y
          links
          types
          names
          floor
          institute
          time
          menuId
          isPassFree
          stairId
        }
      }
    }
  }
`

const stairsQuery = (institute: string) => `
query {
    Stairs (where: {institute: {equals: "${institute}"}} limit: 60) {
      docs {
        stairPoint {
          id
        }
        links {
            stairPoint {
              id
              floor
            }
        }
      }
    }
  }
`

const byTypeQuery = (type: PointTypes, institute?: string, floor?: number) => `
query {
  Graph_points (where: { ${institute ?  `institute: {equals:"${institute}"}` : ""}, ${floor ? `floor: {equals:${floor}}`: ""}, types: {contains:"${type}"} } limit: 20000) {
    docs {
      id 
      x
      y
      links
      types
      names
      floor
      institute
      time
      menuId
      isPassFree
      stairId
    }
  }
}
`

const byNameQuery = (name: string, length: number) => `
query {
  Graph_points (where: { names: {like:"${name}"} }, limit: ${length}) {
    docs {
      id 
      x
      y
      links
      types
      names
      floor
      institute
      time
      menuId
      isPassFree
      stairId
    }
  }
}
`

const byIdQuery = (id: string) => `
query {
  Graph_point (id:"${id}") {
    id 
    x
    y
    links
    types
    names
    floor
    institute
    time
    menuId
    isPassFree
    stairId
  }
}
`

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${urlOrigin}/api/graphql`,
        headers: {
            Authorization: `JWT ${import.meta.env.VITE_BACKEND_JWT}`
        }
    }),
    endpoints: build => ({
        getFloor: build.query<IFloor, IFloorReq>({
            query: ({inst, floor}) => ({
                url: '',
                method: 'POST',
                body: {query: floorQuery(inst, floor)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Floors.docs[0]
            }
        }),
        getInstituteByUrl: build.query<IInstituteIcon, string>({
            query: (url) => ({
                url: '',
                method: 'POST',
                body: {query: instituteUrlQuery(url)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Insitutes.docs[0]
            }
        }),
        getInstitutes: build.query<IInstituteIcon[], number | undefined>({
            query: (page?) => ({
                url: '',
                method: 'POST',
                body: {query: institutesQuery(page)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Insitutes.docs
            }
        }),
        getGraph: build.query<IGraph, IFloorReq>({
            query: ({inst, floor}) => ({
                url: '',
                method: 'POST',
                body: {query: graphQuery(inst, floor)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Floors.docs[0].graph.reduce((accum: any, value: any) => {
                    return {
                        ...accum,
                        [value.id]: value
                    }
                }, {})
            }
        }),
        getStairs: build.query<IGraph, string>({
            query: (inst) => ({
                url: '',
                method: 'POST',
                body: {query: stairsQuery(inst)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Stairs.docs
            }
        }),
        getPointsByType: build.query<IGraphPoint[], IByTypeReq>({
            query: ({ type, institute, floor }) => ({
                url: '',
                method: 'POST',
                body: {query: byTypeQuery(type, institute, floor)}
            }),
            transformResponse: (rawResult: any, _) => {
                return rawResult.data.Graph_points.docs
            }
        }),
        getPointsByName: build.query<IGraphPoint[], IByNameReq>({
          query: ({ name, length }) => ({
              url: '',
              method: 'POST',
              body: {query: byNameQuery(name, length)}
          }),
          transformResponse: (rawResult: any, _) => {
              return rawResult.data.Graph_points.docs
          }
        }),
        getPointById: build.query<IGraphPoint, string>({
          query: (id) => ({
              url: '',
              method: 'POST',
              body: {query: byIdQuery(id)}
          }),
          transformResponse: (rawResult: any, _) => {
              return rawResult.data.Graph_point
          }
        }),
    })
})

export const { 
    useGetFloorQuery,
    useGetInstituteByUrlQuery,
    useGetInstitutesQuery,
    useGetGraphQuery,
    useGetStairsQuery,
    useGetPointsByTypeQuery,
    useGetPointsByNameQuery,
    useGetPointByIdQuery
 } = apiSlice