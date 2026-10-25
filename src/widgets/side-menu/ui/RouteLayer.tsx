import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useMatch } from 'react-router-dom';
import { matchBuilding, useGetBuildingsQuery } from '@/entities/building';
import { selectRoutePoints } from '@/entities/route';
import { fillRouteEntrance } from '@/features/point-search';
import { selectRouteOpen } from '@/entities/sidebar';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

const Overlay = lazy(() => import('./RouteOverlay').then(module => ({ default: module.RouteOverlay })));
export function RouteLayer() {
    const open = useAppSelector(selectRouteOpen);
    const dispatch = useAppDispatch();
    const slug = useMatch('/institute/:intstName')?.params.intstName;
    const { data: buildings } = useGetBuildingsQuery();
    const { to } = useAppSelector(selectRoutePoints);
    const initialized = useRef(false);
    useEffect(() => {
        if (!open) { initialized.current = false; return; }
        if (initialized.current || !slug || !buildings) return;
        const building = matchBuilding(buildings, slug);
        if (!building) return;
        initialized.current = true;
        void dispatch(fillRouteEntrance(building, to?.id));
    }, [open, slug, buildings, dispatch, to?.id]);
    const [visited, setVisited] = useState(false);
    useEffect(() => { if (open) setVisited(true); }, [open]);
    if (!open && !visited) return null;
    return <Suspense fallback={null}><Overlay /></Suspense>;
}
