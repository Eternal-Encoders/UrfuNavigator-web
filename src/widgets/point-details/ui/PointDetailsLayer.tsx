import { lazy, Suspense, useEffect, useState } from 'react';
import { selectPointPresentation } from '@/entities/point';
import { useAppSelector } from '@/shared/lib';

const Details = lazy(() => import('./PointDetails').then(module => ({ default: module.PointDetails })));
export function PointDetailsLayer() {
    const { pointId, focusVersion } = useAppSelector(selectPointPresentation);
    const [visited, setVisited] = useState(false);
    useEffect(() => { if (pointId) setVisited(true); }, [pointId]);
    if (!pointId && !visited) return null;
    return <Suspense fallback={null}><Details key={focusVersion} pointId={pointId} /></Suspense>;
}
