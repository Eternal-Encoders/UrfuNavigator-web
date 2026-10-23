import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { clearSelectedPoint, restorePointDetails, selectSelectedPointId, selectPointPresentation } from '@/entities/point';
import { restorePanel, selectPanelState, SideBarContent } from '@/entities/sidebar';
import { floorSet, selectFloor } from '@/entities/floor';
import { clearRoute, selectRoutePoints } from '@/entities/route';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { createPanelHistory } from '../lib/panelHistory';

type Snapshot = {
    content: SideBarContent, prevContent: SideBarContent, settingsOpen: boolean,
    campusOpen: boolean, routeDocked: boolean, routeOpen: boolean, routeContent: SideBarContent, restingHeight: number,
    floor?: string, routeRevision?: number,
    pointId?: string, detailsCollapsed?: boolean, previewEnabled?: boolean
};
const key = (s: Snapshot) => JSON.stringify([s.content, s.settingsOpen, s.campusOpen, s.routeOpen, s.routeContent,
    s.routeDocked, s.routeDocked ? s.floor : undefined,
    s.pointId, s.detailsCollapsed, s.previewEnabled,
    [SideBarContent.Empty, SideBarContent.Institutes].includes(s.content) ? s.restingHeight <= 80 : false]);

export function usePanelBack() {
    const dispatch = useAppDispatch();
    const panel = useAppSelector(selectPanelState);
    const floor = useAppSelector(selectFloor);
    const { revision: routeRevision } = useAppSelector(selectRoutePoints);
    const currentPanel = useRef(panel);
    currentPanel.current = panel;
    const pointId = useAppSelector(selectSelectedPointId);
    const { detailsCollapsed, previewEnabled } = useAppSelector(selectPointPresentation);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const { pathname } = useLocation();
    const snapshot: Snapshot = {
        content: panel.content, prevContent: panel.prevContent,
        settingsOpen: panel.settingsOpen, campusOpen: panel.campusOpen,
        routeOpen: panel.routeOpen, routeDocked: panel.routeDocked, routeContent: panel.routeContent,
        restingHeight: panel.restingHeight, floor, routeRevision,
        pointId, detailsCollapsed, previewEnabled };
    const controller = useRef<ReturnType<typeof createPanelHistory<Snapshot>> | null>(null);
    useEffect(() => {
        if (!isPhone) return;
        const history = createPanelHistory<Snapshot>(window, key, s => Boolean(
            s.settingsOpen || s.campusOpen || s.routeOpen || s.routeDocked || s.pointId
            || ![SideBarContent.Empty, SideBarContent.Institutes].includes(s.content)), s => {
            const { pointId: selected, detailsCollapsed: collapsed, previewEnabled: preview,
                floor: restoredFloor, routeRevision: _routeRevision, ...panelState } = s;
            if (s.routeDocked && restoredFloor) dispatch(floorSet({ floor: restoredFloor, priority: 1 }));
            if ((currentPanel.current.routeDocked || currentPanel.current.routeOpen)
                && !s.routeDocked && !s.routeOpen) dispatch(clearRoute());
            dispatch(restorePanel(panelState));
            dispatch(selected ? restorePointDetails({ pointId: selected, previewEnabled: Boolean(preview),
                detailsCollapsed: Boolean(collapsed) }) : clearSelectedPoint());
        }, (s, previous) => {
            if (!s.routeDocked || s.routeContent !== SideBarContent.Route
                || s.routeOpen || s.settingsOpen || s.campusOpen || s.pointId) return;
            if (previous.routeDocked && previous.routeRevision === s.routeRevision
                && previous.floor && previous.floor !== s.floor) return;
            const base = window.location.pathname === '/' ? SideBarContent.Institutes : SideBarContent.Empty;
            return { ...s, content: base, prevContent: base, routeDocked: false, routeOpen: false, restingHeight: 244 };
        }, (current, previous) => Boolean(current.routeDocked && previous.routeDocked
            && current.routeRevision === previous.routeRevision && current.floor && previous.floor
            && current.floor !== previous.floor));
        controller.current = history;
        return () => { history.dispose(); controller.current = null; };
    }, [dispatch, isPhone]);
    useEffect(() => {
        const base = pathname === '/' ? SideBarContent.Institutes : SideBarContent.Empty;
        controller.current?.sync(snapshot, { content: base, prevContent: base,
            settingsOpen: false, campusOpen: false, routeOpen: false, routeDocked: false,
            routeContent: SideBarContent.Route, restingHeight: 244 });
    });
}
