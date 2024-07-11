import axios from "axios";
import { 
  IGraphPoint, 
  IGraphQLRes, 
  IMapObject, 
  IStair,
  PointTypes 
} from "./interfaces";

async function httpConnect<Type>(address: string, query: string): Promise<Type> {
  const urlOrigin = import.meta.env.VITE_BACKEND_ORIGIN ? import.meta.env.VITE_BACKEND_ORIGIN : 'https://how-to-navigate.ru:2083'
  const origin = axios.create({
      baseURL: `${urlOrigin}/api/graphql`,
      headers: {
        Authorization: `JWT ${import.meta.env.VITE_BACKEND_JWT}`
      }
  });
  const response = await origin.post(address, {
    query: query
  });

  return response.data as Type;
}

async function findGraph(institute: string, floor: number) : Promise<{ [id: string]: IGraphPoint; }> {
  return httpConnect<IGraphQLRes<IMapObject>>('', 
  `
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
  )
  .then((e) => {
    return e.data.Floors.docs[0].graph.reduce((accum, value) => {
      return {
          ...accum,
          [value.id]: value
      }
  }, {})});
}

async function findDataByType(type: PointTypes, institute?: string, floor?: number) {
  const floorStr = `floor: {equals:${floor}}`;
  const instituteStr = `institute: {equals:"${institute}"}`

  return httpConnect<IGraphQLRes<IGraphPoint>>('', `
  query {
      Graph_points (where: { ${institute ? instituteStr: ""}, ${floor ? floorStr: ""}, types: {contains:"${type}"} } limit: 20000) {
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
  `)
  .then((e) => e.data.Graph_points.docs);
}


async function findStairs(institute: string) : Promise<IStair[]> {
    return httpConnect<IGraphQLRes<IStair>>('', `
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
    `)
    .then((e) => e.data.Stairs.docs);
}


export { 
    findStairs,
    findGraph,
    findDataByType,
};