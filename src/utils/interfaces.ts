export interface Ilngs {
    en: 'English',
    ru: 'Русский'
}

export const enum PointTypes {
    Corridor= "corridor",
    Auditorium = "auditorium",
    Dinning = "dinning",
    Exit = "exit",
    Stair = "stair",
    ToiletM = "toilet-m",
    ToiletW = "toilet-w",
    Cafe = "cafe",
    Vending = "vending",
    Coworking = "coworking",
    Atm = "atm",
    Wardrobe = "wardrobe",
    Print = "print",
    Deanery = "deanery",
    Students = "students",
    Other = "other"
}

export const enum WeekDay {
    Mon = 0,
    Tue = 1,
    Wed = 2,
    Thu = 3,
    Fri = 4,
    Sat = 5,
    Sun = 6
}

export const enum DrawerOrient {
    Horizontal = 'h',
    Vertical = 'v'
}

export const enum SideBarContent {
    Institutes = "institutes",
    Settings = "settings",
    TypeList = "typeList",
    PointsList = "pointsList",
    Empty = "empty"
}

export interface ITime {
    isDayOff: boolean | null
    from: string,
    to: string
}
  
export type IWeek = [
    ITime | null, 
    ITime | null, 
    ITime | null, 
    ITime | null, 
    ITime | null, 
    ITime | null, 
    ITime | null
];

export const PointTranslation = {
    [PointTypes.Corridor]: "Коридор",
    [PointTypes.Auditorium]: "Аудитория",
    [PointTypes.Dinning]: "Столовая",
    [PointTypes.Exit]: "Вход/Выход",
    [PointTypes.Stair]: "Лустница",
    [PointTypes.ToiletM]: "Туалет (М)",
    [PointTypes.ToiletW]: "Туалет (Ж)",
    [PointTypes.Cafe]: "Кафе",
    [PointTypes.Vending]: "Вендинг",
    [PointTypes.Coworking]: "Коворкинг",
    [PointTypes.Atm]: "Банкомат",
    [PointTypes.Wardrobe]: "Гардероб",
    [PointTypes.Print]: "Печать",
    [PointTypes.Deanery]: "Деканат",
    [PointTypes.Students]: "Союз Студентов",
    [PointTypes.Other]: "Другое..."
};

export const enum Languages {
    English = "english",
    Russian = "russian"
}

export interface IAuditoriumDoors {
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string
}

export interface IAuditoriumChild {
    type: "text" | "icon",
    x: number,
    y: number,
    identifier: string,
    alignX: "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED" | "",
    alignY: "CENTER" | "TOP" | "BOTTOM" | ""
  }
  
export interface IAuditorium {
    id: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fill: string | null,
    stroke: string | null,
    pointId: string,
    children: IAuditoriumChild[],
    doors: IAuditoriumDoors[]
}

export interface IGraphPoint {
    id: string
    x: number,
    y: number,
    links: string[],
    types: PointTypes[],
    names: string[],
    floor: number,
    institute: string,
    time: IWeek,
    description: string,
    info: string,
    menuId: string | null,
    isPassFree: boolean | null,
    stairId: string | null
}

export interface IService {
    x: number,
    y: number,
    data: string,
    stroke: string | null,
    fiil: string | null
}

export interface IMapObject {
    service: IService[],
    audiences: IAuditorium[],
    institute: string,
    floor: number,
    width: number,
    height: number
}

export interface IInstitute {
    name: string,
    displayableName: string,
    minFloor: number,
    maxFloor: number,
    url: string,
    latitude: number,
    longitude: number,
    icon: {
        url: string,
        alt: string
    }
}

export interface IPath {
    [institute: string]: {
        [floor: number]: IGraphPoint[][]
    }
}