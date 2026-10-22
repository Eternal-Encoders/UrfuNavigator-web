import { lazy, Suspense, useEffect, useState } from 'react';
import { selectCampusOpen } from '@/entities/sidebar';
import { useAppSelector } from '@/shared/lib';

const Overlay = lazy(() => import('./CampusOverlay').then(module => ({ default: module.CampusOverlay })));
export function CampusLayer() {
    const open = useAppSelector(selectCampusOpen);
    const [visited, setVisited] = useState(false);
    useEffect(() => { if (open) setVisited(true); }, [open]);
    if (!open && !visited) return null;
    return <Suspense fallback={null}><Overlay /></Suspense>;
}
