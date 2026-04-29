import { RefObject } from 'react';
import { useAppSelector } from '../../../store/hook';
import { Stage } from 'konva/lib/Stage';
import { selectFloor } from '../../../features/floor/floorSlice';
import { selectSearchPoints } from '../../../features/pointsSearch/pointsSearchSlice';
import { useMapManipulation } from './useMapManipulation';
import { useMapFloorData } from './useMapFloorData';

interface MapHookProps {
    name: string,
    stageRef: RefObject<Stage | null>
}

export function useMapHook({ name, stageRef }: MapHookProps) {
    const currentFloor = useAppSelector(selectFloor);
    const points = useAppSelector(selectSearchPoints);
    const innerState = useMapFloorData({ name, currentFloor });

    const mapManipulationData = useMapManipulation({ mapSize: innerState.mapSize , stageRef })

    return {
        mapManipulationData,
        coordsPredictor: innerState.coordsPredictor,
        headingPredictor: innerState.headingPredictor,
        floor: innerState.floor,
        services: innerState.services,
        mapSize: innerState.mapSize,
        points,
        currentFloor
    }
}