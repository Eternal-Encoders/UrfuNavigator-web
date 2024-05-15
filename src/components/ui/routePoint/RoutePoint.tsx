import { useEffect, useState } from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import { IGraphPoint } from "../../../utils/interfaces";
import { findPointById } from "../../../utils/server-connect";

import pointImg from "./img/routePoint.svg"
import "./route-point-style.css";

interface RoutePointProps {
    point: IGraphPoint,
    isStart: boolean
}

function RoutePoint({ point, isStart }: RoutePointProps) {
    const [usePointImg] = useImage(pointImg);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        async function getRotation() {
            const neighbourPoint = await findPointById(point.links[0]);
            const xDif = point.x - neighbourPoint.x;
            const yDif = point.y - neighbourPoint.y;

            if (xDif === 0){
                yDif > 0 ? setRotation(90) : setRotation(270)
                console
            } else {
                xDif > 0 ? setRotation(0) : setRotation(180)
            }

            if (isStart) setRotation(rotation => rotation + 180)
        }

        void getRotation()
    }, [point, setRotation]);

    return (
        <Image 
            image={ usePointImg } 
            x={ point.x } 
            y={ point.y } 
            width={ 50 } 
            height={ 50 }
            rotation={ rotation }
            offsetX={ 25 }
            offsetY={ 25 }/>
    )
}

export default RoutePoint;