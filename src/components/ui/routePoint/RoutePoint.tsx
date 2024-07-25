import { Image } from "react-konva";
import useImage from "use-image";

import { useRoutePoint } from "./RoutePointHook";
import { IGraphPoint } from "../../../utils/interfaces";
import pointImg from "./img/routePoint.svg"
// import style from "./route-point-style.module.css";

interface RoutePointProps {
    point: IGraphPoint,
    isStart: boolean
}

function RoutePoint({ point }: RoutePointProps) {
    const [usePointImg] = useImage(pointImg);
    const {  getRotation } = useRoutePoint(point.links[0])

    return (
        <Image 
            image={ usePointImg } 
            x={ point.x } 
            y={ point.y } 
            width={ 50 } 
            height={ 50 }
            rotation={ getRotation(point) }
            offsetX={ 25 }
            offsetY={ 25 }
        />
    )
}

export default RoutePoint;