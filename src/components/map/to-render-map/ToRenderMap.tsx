import Konva from 'konva';
import { useRef } from 'react';
import { Layer, Stage } from 'react-konva';

import { IInstitute, IInstituteGps, UserGPS } from '../../../utils/interfaces';
import { getAudiences, getService } from '../../../utils/translateToKonva';
import { useMapHook } from './MapHook';

import RoutePoint from '../../../widgets/routePoint/RoutePoint';
import PathMap from '../path-map/PathMap';
import style from './to-render-map-style.module.css';
import { boundGpsToMap } from '../../../utils/gps';
import { GpsPoint } from '../../konva-components';


interface ToRenderMapProps extends IInstitute {
    userGps: UserGPS | undefined,
    mapGps: IInstituteGps[] | undefined
}

function ToRenderMap({ name, userGps, mapGps }: ToRenderMapProps) {
    const stageRef = useRef<Konva.Stage | null>(null);

    const {
        mapManipulationData: {
            innerWidth,
            innerHeight,
            isTouchEnabled,
            handelDragBound,
            zoomStage,
            handleTouch,
            handleTouchEnd
        },
        floor,
        services,
        points,
        currentFloor,
        coordsPredictor,
        headingPredictor,
        mapSize
    } = useMapHook({
        name: name,
        mapGps: mapGps,
        stageRef: stageRef
    });

    return (
        <Stage 
            width={innerWidth} 
            height={innerHeight}
            x={innerWidth > 1200 ? innerWidth * 0.4 : innerWidth * 0.1}
            scaleX={Math.min(innerHeight, innerWidth) / 3500}
            scaleY={Math.min(innerHeight, innerWidth) / 3500}
            className={style['to-render-map']}
            draggable={!isTouchEnabled}
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
                    <PathMap institute={name} />
                }    
                {points.from && 
                    points.from.floor === currentFloor && 
                    points.from.institute === name && 
                    <RoutePoint point={ points.from } isStart={ true }/>
                }
                {points.to && 
                    points.to.floor === currentFloor && 
                    points.to.institute === name && 
                    <RoutePoint point={ points.to } isStart={ false }/>
                }
                {mapGps && userGps && coordsPredictor &&
                    <GpsPoint
                        coords={boundGpsToMap(coordsPredictor(userGps), mapSize)}
                        rotation={headingPredictor ? headingPredictor(userGps.heading) : 0}
                    />
                }
            </Layer>
        </Stage>
    )
}

export default ToRenderMap