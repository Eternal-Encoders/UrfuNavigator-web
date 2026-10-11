import { skipToken } from '@reduxjs/toolkit/query';
import { useEffect, useRef, useState } from 'react';
import { matchBuilding, sortedFloors, useGetBuildingQuery, useGetBuildingsQuery } from '@/entities/building';
import { floorReset, floorSet } from '@/entities/floor';
import { selectRoutePoints } from '@/entities/route';
import { useUserLocation } from '@/features/user-location';
import { apiErrorText, type IBuildingGps } from '@/shared/api';
import { GPS_BUFFER } from '@/shared/config';
import { approxGps, getClosestFloor, useAppDispatch, useAppSelector } from '@/shared/lib';

const OBJECT_ID = /^[a-f0-9]{24}$/i;

export function useInstituteBuilding(slug: string) {
    const dispatch = useAppDispatch()
    const points = useAppSelector(selectRoutePoints)
    const initializedBuildingId = useRef<string | undefined>(undefined)
    const [mapGps, setMapGps] = useState<IBuildingGps[] | undefined>(undefined)
    const { userLoc, userGPSState } = useUserLocation(GPS_BUFFER)

    const { data: buildings, error, isLoading } = useGetBuildingsQuery()
    const { data: buildingById, isLoading: isBuildingLoading } = useGetBuildingQuery(
        OBJECT_ID.test(slug) ? slug : skipToken
    )
    const building = (buildings && slug ? matchBuilding(buildings, slug) : undefined) ?? buildingById

    useEffect(() => {
        if (!building || initializedBuildingId.current === building.id) {
            return
        }
        initializedBuildingId.current = building.id

        const floorIds = new Set(building.floors.map((floor) => floor.id))
        const selected = [points.from, points.to].find((point) =>
            point && point.buildingId === building.id && floorIds.has(point.floorId)
        )
        if (selected) {
            dispatch(floorSet({ floor: selected.floorId, priority: 1 }))
            return
        }
        const nextFloor = sortedFloors(building.floors)[0]
        if (nextFloor) {
            dispatch(floorReset(nextFloor.id))
        }
    }, [building, dispatch, points.from, points.to])

    useEffect(() => {
        if (!building?.gps?.length || !userGPSState) {
            setMapGps(undefined)
            return
        }
        setMapGps(building.gps)
        dispatch(floorSet({
            floor: getClosestFloor(building.gps, approxGps(userLoc)).floorId,
            priority: 0
        }))
    }, [building, dispatch, userGPSState, userLoc])

    return {
        building,
        isLoading: isLoading || isBuildingLoading,
        error: apiErrorText(error),
        mapGps,
        userGps: approxGps(userLoc)
    }
}
