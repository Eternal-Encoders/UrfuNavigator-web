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

export type AlignX = 'LEFT' | 'RIGHT' | 'CENTER'
export type AlignY = 'TOP' | 'BOTTOM' | 'CENTER'

export interface IPointShape {
    type: 'point',
    x: number,
    y: number
}

export interface IRectangleShape {
    type: 'rectangle',
    x: number,
    y: number,
    width: number,
    height: number
}

export interface IPolyShape {
    type: 'poly',
    x: number,
    y: number,
    points: Array<{ x: number, y: number }>
}

export interface IContainerShape {
    type: 'container',
    x: number,
    y: number,
    width: number,
    height: number,
    alignX: AlignX,
    alignY: AlignY,
    children: IShape[]
}

export interface ITextShape {
    type: 'text',
    x: number,
    y: number,
    alignX: AlignX,
    alignY: AlignY,
    text: string
}

export interface IIconShape {
    type: 'icon',
    x: number,
    y: number,
    width: number,
    height: number,
    icon: string
}

export interface IDoorShape {
    type: 'door',
    wallId: number,
    length: number,
    offset: number
}

export type IShape =
    | IPointShape
    | IRectangleShape
    | IPolyShape
    | IContainerShape
    | ITextShape
    | IIconShape
    | IDoorShape

export interface IRoom {
    id: string,
    displayableName: string,
    shape: IShape,
    pointId?: string | null,
    type?: string | null,
    children?: Array<IShape | IRoom>,
    colorSchema?: string | null,
    isBorder?: boolean,
    isFill?: boolean
}

export interface IService {
    id: string,
    displayableName: string,
    shape: IShape,
    colorSchema?: string | null,
    isBorder?: boolean,
    isFill?: boolean
}

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

export interface IColorTheme {
    buildingBorder?: string,
    buildingFill?: string,
    buildingBackground?: string,
    roomBorder?: string,
    roomFill?: string,
    roomText?: string,
    roomTypeBorder?: Record<string, string>,
    roomTypeFill?: Record<string, string>,
    roomTypeText?: Record<string, string>
}

export interface IColorSchema {
    id: string,
    displayableName: string,
    accentColor: string,
    whiteColorTheme?: IColorTheme,
    darkColorTheme?: IColorTheme
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
