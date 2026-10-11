import { skipToken } from '@reduxjs/toolkit/query';
import { useMemo } from 'react';
import { useGetFloorQuery } from '@/entities/floor';
import type { IRoom, IService } from '@/shared/api';
import { createPredictor, type UserGPS } from '@/shared/lib';

interface FloorData {
    coordsPredictor: ((loc: UserGPS) => { x: number, y: number }) | null,
    headingPredictor: ((heading: number) => number) | null,
    rooms: IRoom[],
    services: IService[],
    mapSize: { width: number, height: number }
}

const emptyFloor: FloorData = {
    coordsPredictor: null,
    headingPredictor: null,
    rooms: [],
    services: [],
    mapSize: {
        width: 0,
        height: 0
    }
}

export function useFloorData(floorId: string) {
    const { currentData } = useGetFloorQuery(floorId || skipToken)
    const isReady = Boolean(floorId) && currentData?.id === floorId

    const floorData = useMemo<FloorData>(() => {
        if (!isReady || !currentData) {
            return emptyFloor
        }

        const [coordsPredictor, headingPredictor] = currentData.gps
            ? createPredictor(currentData.gps)
            : [null, null]

        return {
            coordsPredictor,
            headingPredictor,
            rooms: currentData.rooms ?? [],
            services: currentData.services ?? [],
            mapSize: {
                width: currentData.width,
                height: currentData.height
            }
        }
    }, [currentData, isReady])

    return {
        ...floorData,
        isResolving: !isReady
    }
}
