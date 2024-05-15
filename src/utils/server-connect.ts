import axios from "axios";
import { 
    IAuditorium,
    IGraphPoint, 
    IGraphQLRes, 
    IInstituteIcon, 
    IMapObject, 
    IService, 
    IStair,
    PointTypes 
} from "./interfaces";

async function httpConnect<Type>(address: string, query: string): Promise<Type> {
    //const urlOrigin = window.location.hostname !== 'localhost' ? window.location.origin: 'http://localhost:5000'
    const urlOrigin = import.meta.env.VITE_ORIGIN ? import.meta.env.VITE_ORIGIN as string: 'http://localhost:5000'
    const origin = axios.create({
        baseURL: `${urlOrigin}/api/graphql`,
        headers: {
          Authorization: `JWT 4c2182c841eba6b8d0bd9fda`
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

async function findPointById(id: string) : Promise<IGraphPoint> {
    return httpConnect<{ data: { Graph_point: IGraphPoint } }>('', `
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
    `)
    .then((e) => e.data.Graph_point);
}

async function findAudiences(institute: string, floor: number) : Promise<{
  width: number, 
  height:number, 
  audiences: IAuditorium[], 
  service: IService[]
}> {
    return httpConnect<IGraphQLRes<{
      width: number, 
      height:number, 
      audiences: IAuditorium[], 
      service: IService[]
    }>>('',
        `
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
        )
        .then((e) => e.data.Floors.docs[0]);
}

async function findSearchResults(name: string, length: number) : Promise<IGraphPoint[]> {
    return httpConnect<IGraphQLRes<IGraphPoint>>('', `
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

async function findInstituteIcon(page?: number) : Promise<IInstituteIcon[]> {
  return httpConnect<IGraphQLRes<IInstituteIcon>>('', `
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
  `)
  .then((e) => e.data.Insitutes.docs);
}

async function findInstituteByUrl(url: string) : Promise<IInstituteIcon> {
  return httpConnect<IGraphQLRes<IInstituteIcon>>('', `
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
  `)
  .then((e) => e.data.Insitutes.docs)
  .then((e) => {
    if (e.length !== 0) {
      return e[0];
    } else {
      throw new Error("Not Correct url")
    }
  });
}

export { 
    findAudiences, 
    findStairs,
    findSearchResults,
    findGraph,
    findPointById,
    findDataByType,
    findInstituteIcon,
    findInstituteByUrl
};