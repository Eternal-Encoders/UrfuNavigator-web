import { useEffect } from 'react';
import { preloadInstitutePage } from '@/pages/institute';
import { instituteRoute, defaultFloor, useGetBuildingsQuery } from '@/entities/building';
import { floorApi } from '@/entities/floor';
import { selectRoutePoints } from '@/entities/route';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

/** Fetch only the destination the user points to, never all buildings/floors on startup. */
export function usePagePreload() {
    const dispatch = useAppDispatch();
    const { data: buildings } = useGetBuildingsQuery();
    const points = useAppSelector(selectRoutePoints);
    useEffect(() => {
        function preload(event: Event) {
            if (!(event.target instanceof Element)) return;
            const link = event.target.closest<HTMLAnchorElement>('a[href]');
            if (!link || link.origin !== location.origin || !link.pathname.startsWith('/institute/')) return;
            const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
            if (connection?.saveData) return;
            void preloadInstitutePage().catch(() => { /* Normal navigation can retry a failed preload. */ });
            const building = buildings?.find(item => instituteRoute(item) === link.pathname);
            if (!building) return;
            const selected = [points.from, points.to].find(point => point?.buildingId === building.id
                && building.floors.some(floor => floor.id === point.floorId));
            const floorId = selected?.floorId ?? defaultFloor(building.floors)?.id;
            if (floorId) dispatch(floorApi.util.prefetch('getFloor', floorId, { ifOlderThan: 60 }));
        }
        const events = ['pointerover', 'focusin', 'touchstart', 'pointerdown'];
        events.forEach(type => document.addEventListener(type, preload, { passive: true }));
        return () => events.forEach(type => document.removeEventListener(type, preload));
    }, [buildings, dispatch, points]);
}
