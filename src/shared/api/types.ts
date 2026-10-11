import type { IColorSchema, IRoom, IService } from '@eternal-encoders/konva-floor-plan';

export enum PointTypes {
    Corridor = 'corridor',
    Auditorium = 'auditorium',
    Dinning = 'dinning',
    Exit = 'exit',
    Stair = 'stair',
    ToiletM = 'toilet-m',
    ToiletW = 'toilet-w',
    Cafe = 'cafe',
    Vending = 'vending',
    Coworking = 'coworking',
    Atm = 'atm',
    Wardrobe = 'wardrobe',
    Print = 'print',
    Deanery = 'deanery',
    Students = 'students',
    Other = 'other'
}

export type {
    AlignX,
    AlignY,
    IColorSchema,
    IColorTheme,
    IContainerShape,
    IDoorShape,
    IIconShape,
    IPointShape,
    IPolyShape,
    IRectangleShape,
    IRoom,
    IService,
    IShape,
    ITextShape
} from '@eternal-encoders/konva-floor-plan';

export interface IPointName {
    name: string,
    translations?: Array<{
        language: string,
        value: string
    }>
}

export interface IWeekdayTime {
    start: number,
    end: number,
    isDayOff: boolean
}

export interface IWeekTime {
    monday?: IWeekdayTime,
    tuesday?: IWeekdayTime,
    wednesday?: IWeekdayTime,
    thursday?: IWeekdayTime,
    friday?: IWeekdayTime,
    saturday?: IWeekdayTime,
    sunday?: IWeekdayTime
}

export interface IGraphPoint {
    id: string,
    displayableName: string,
    buildingId: string,
    floorId: string,
    x: number,
    y: number,
    links: string[],
    types: PointTypes[],
    names: IPointName[],
    time?: IWeekTime,
    description?: string,
    info?: string,
    isPassFree?: boolean
}

export interface ILinearEq {
    b1: number,
    b2: number,
    a: number
}

export interface IStabForce {
    point: {
        x: number,
        y: number
    },
    force: {
        x: number,
        y: number
    }
}

export interface IFloorGps {
    altitude: number,
    linear: {
        x: ILinearEq,
        y: ILinearEq
    },
    forces: IStabForce[]
}

export interface IFloorSummary {
    id: string,
    displayableName: string
}

export interface IFloor {
    id: string,
    displayableName: string,
    buildingId: string,
    elevation: number,
    width: number,
    height: number,
    rooms: IRoom[],
    services: IService[],
    graph: IGraphPoint[],
    gps?: IFloorGps
}

export interface IIconUrl {
    name: string,
    url: string,
    expiresAt: string
}

export interface IBuildingGps {
    centreAltitude: number,
    floorId: string
}

export interface IBuilding {
    id: string,
    displayableName: string,
    floors: IFloorSummary[],
    url: string,
    latitude: number,
    longitude: number,
    icon: IIconUrl,
    colorSchemes: IColorSchema[],
    gps?: IBuildingGps[] | null
}

export interface IPath {
    [buildingId: string]: {
        [floorId: string]: IGraphPoint[][]
    }
}

export interface IPathRes {
    result: IPath
}
