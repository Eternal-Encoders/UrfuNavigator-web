import { useEffect, useRef } from 'react';
import { selectRoutePoints } from '@/entities/route';
import { selectPanelState, setRouteDocked, setRouteOpen, setContent, SideBarContent } from '@/entities/sidebar';
import { setSearchDirection } from '@/features/point-search';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

export function useRoutePresentation() {
    const dispatch = useAppDispatch();
    const { from, to } = useAppSelector(selectRoutePoints);
    const { routeDocked, routeOpen, routeContent } = useAppSelector(selectPanelState);
    const previousFrom = useRef<string | undefined>(undefined);
    useEffect(() => {
        const changed = previousFrom.current !== from?.id;
        previousFrom.current = from?.id;
        if (!changed || !from || (!routeOpen && !routeDocked)) return;
        dispatch(setSearchDirection('to'));
        if (!to) {
            dispatch(setContent(SideBarContent.TypeList));
        }
    }, [dispatch, from, to, routeOpen, routeDocked, routeContent]);
    useEffect(() => {
        if (from && to) {
            if (routeContent === SideBarContent.Route && (!routeDocked || routeOpen)) dispatch(setRouteDocked(true));
        } else if (routeDocked && !from && !to && routeContent === SideBarContent.Route) {
            dispatch(setRouteDocked(false));
            dispatch(setRouteOpen(false));
        }
    }, [dispatch, from, to, routeDocked, routeOpen, routeContent]);
}
