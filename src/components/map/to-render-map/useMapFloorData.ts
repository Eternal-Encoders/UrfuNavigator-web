import { useEffect, useState } from 'react';
import { useGetFloorQuery } from '../../../features/api/apiSlice';
import { IAuditorium, IFloorGps, IService, UserGPS } from '../../../utils/interfaces';
import { createPredictor } from '../../../utils/gps';

interface UseMapFloorDataProps {
    name: string,
    currentFloor: number
}

export function useMapFloorData({ name, currentFloor }: UseMapFloorDataProps) {
    const { data } = useGetFloorQuery({
        inst: name,
        floor: currentFloor
    })

    const [innerState, setInnerState] = useState<{
        instituteGps: IFloorGps | null,
        coordsPredictor: ((loc: UserGPS) => { x: number, y: number }) | null,
        headingPredictor: ((heading: number) => number) | null,
        floor: IAuditorium[],
        services: IService[],
        mapSize: {
            width: number,
            height: number
        }
    }>({
        instituteGps: null,
        coordsPredictor: null,
        headingPredictor: null,
        floor: [],
        services: [],
        mapSize: {
            width: 0,
            height: 0
        }
    })

    useEffect(() => {
        if (!data) {
            return;
        }

        const [coordsPredictor, headingPredictor] = data.gps ? createPredictor(data.gps) : [null, null]
        setInnerState({
            instituteGps: data.gps ?? null,
            coordsPredictor: coordsPredictor,
            headingPredictor: headingPredictor,
            floor: data.audiences,
            services: data.service,
            mapSize: {
                width: data.width,
                height: data.height
            }
        })
    }, [data])

    return innerState;
}
