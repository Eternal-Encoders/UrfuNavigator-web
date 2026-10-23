import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { createBuildingVisitTracker, matchBuilding, useGetBuildingsQuery } from '@/entities/building';

export function useBuildingVisits() {
    const { pathname } = useLocation();
    const { data: buildings } = useGetBuildingsQuery();
    const track = useRef(createBuildingVisitTracker());
    useEffect(() => {
        const slug = /^\/institute\/([^/]+)\/?$/.exec(pathname)?.[1];
        if (!slug) { track.current(); return; }
        if (!buildings) return;
        const building = matchBuilding(buildings, slug);
        if (building) track.current(building.url.replace(/^\/+/, '') || building.id);
    }, [pathname, buildings]);
}
