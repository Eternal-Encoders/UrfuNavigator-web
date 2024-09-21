import Konva from 'konva';
import { useRef } from 'react';
import { Layer, Stage } from 'react-konva';

import { useGetFloorQuery } from '../../../features/api/apiSlice';
import { selectFloor } from '../../../features/floor/floorSlice';
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice';
import { useAppSelector } from '../../../store/hook';
import { IAuditorium, IService } from '../../../utils/interfaces';
import { getAudiences, getService } from '../../../utils/translateToKonva';
import { useMapHook } from './MapHook';

import RoutePoint from '../../../widgets/routePoint/RoutePoint';
import PathMap from '../path-map/PathMap';
import style from './to-render-map-style.module.css';


interface ToRenderMapProps {
    instFullName: string,
    firstFloor: number,
    lastFloor: number
}

function ToRenderMap({ instFullName }: ToRenderMapProps) {
    const stageRef = useRef<Konva.Stage>(null);

    const currentFloor = useAppSelector(selectFloor)
    const points = useAppSelector(selectSearchPoints)
    const { data } = useGetFloorQuery({
        inst: instFullName,
        floor: currentFloor
    })

    let floor: IAuditorium[] = []
    let services: IService[] = []
    let mapSize = {
        width: 0,
        height: 0
    } 

    if (data) {
        floor = data.audiences
        services = data.service
        mapSize = {
            width: data.width,
            height: data.height
        }
    }

    const {
        width,
        height,
        isTouchEnabled,
        handelDragBound,
        zoomStage,
        handleTouch,
        handleTouchEnd
    } = useMapHook({mapSize,  stageRef})

    return (
        <Stage 
            width={width} 
            height={height}
            x={width > 1200 ? width * 0.4 : width * 0.1}
            scaleX={Math.min(height, width) / 3500}
            scaleY={Math.min(height, width) / 3500}
            className={style['to-render-map']}
            draggable={!isTouchEnabled()}
            onDragMove={() => {}}
            dragBoundFunc={handelDragBound}
            onWheel={zoomStage}
            onTouchMove={handleTouch}
            onTouchEnd={handleTouchEnd}
            ref={stageRef}
        >
            <Layer>
                {getAudiences(floor)}
                {getService(services)}
                {points.from && points.to &&    
                    <PathMap institute={instFullName} />
                }    
                {points.from && 
                    points.from.floor === currentFloor && 
                    points.from.institute === instFullName && 
                    <RoutePoint point={ points.from } isStart={ true }/>}
                {points.to && 
                    points.to.floor === currentFloor && 
                    points.to.institute === instFullName && 
                    <RoutePoint point={ points.to } isStart={ false }/>}
            </Layer>
        </Stage>
    )
}

export default ToRenderMap