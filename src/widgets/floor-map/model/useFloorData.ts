import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
import { useGetFloorQuery } from '@/entities/floor';
import type { IRoom, IService } from '@/shared/api';
import { createPredictor, type UserGPS } from '@/shared/lib';
import type { Size } from '../lib/geometry';

interface FloorData {
    coordsPredictor: ((loc: UserGPS) => { x: number, y: number }) | null,
    headingPredictor: ((heading: number) => number) | null,
    rooms: IRoom[],
    services: IService[],
    mapSize: Size
}

export function useFloorData(floorId: string) {
    const { data } = useGetFloorQuery(floorId || skipToken)

    const [floorData, setFloorData] = useState<FloorData>({
        coordsPredictor: null,
        headingPredictor: null,
        rooms: [],
        services: [],
        mapSize: {
            width: 0,
            height: 0
        }
    })

    useEffect(() => {
        if (!data || data.id !== floorId) {
            return;
        }

        const [coordsPredictor, headingPredictor] = data.gps ? createPredictor(data.gps) : [null, null]
        setFloorData({
            coordsPredictor,
            headingPredictor,
            rooms: data.rooms ?? [],
            services: data.services ?? [],
            mapSize: {
                width: data.width,
                height: data.height
            }
        })
    }, [data, floorId])

    return floorData;
}
