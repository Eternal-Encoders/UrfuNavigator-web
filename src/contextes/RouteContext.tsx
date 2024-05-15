import { createContext, useState } from "react";
import { IGraphPoint } from "../utils/interfaces";
import { PointSearchTyping } from "../utils/const";

interface IRouteContext {
    isStartPoint: boolean,
    points: { [key in PointSearchTyping]?: IGraphPoint },
    floors: { [x: string]: string[] },
    setIsStartPoint: (isStartPoint: boolean) => void,
    setPoints: (points: {[key in PointSearchTyping]?: IGraphPoint}) => void,
    setFloors: (floors: {[x: string]: string[];}) => void,
}

export const RouteContext = createContext<IRouteContext>({
    isStartPoint: false,
    points: {
        [PointSearchTyping.start]: undefined,
        [PointSearchTyping.end]: undefined
    },
    floors: { '': [''] },
    setIsStartPoint: () => {},
    setPoints: () => {},
    setFloors: () => {}
});
  
export const RouteState = ({ children }: {children: React.ReactNode}) => {
    const [isStartPoint, setIsStartPoint] = useState(false);
    const [points, setPoints] = useState<{[key in PointSearchTyping]?: IGraphPoint}>({
        [PointSearchTyping.start]: undefined,
        [PointSearchTyping.end]: undefined
    })
    const [floors, setFloors] = useState<{ [x: string]: string[] }>({'': ['']})

    return (
        <RouteContext.Provider value={{
            isStartPoint,
            points,
            floors,
            setIsStartPoint,
            setPoints,
            setFloors
        }}>
            {children}
        </RouteContext.Provider>
    );
}