import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { clearSelectedPoint, selectPoint, selectSelectedPointId } from '@/entities/point';
import { restorePanel, selectPanelState, SideBarContent } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { createPanelHistory } from '../lib/panelHistory';

type Snapshot = {
    content: SideBarContent, prevContent: SideBarContent, settingsOpen: boolean,
    campusOpen: boolean, restingHeight: number, pointId?: string
};
const key = (s: Snapshot) => JSON.stringify([s.content, s.settingsOpen, s.campusOpen, s.pointId,
    [SideBarContent.Empty, SideBarContent.Institutes].includes(s.content) ? s.restingHeight <= 80 : false]);

export function usePanelBack() {
    const dispatch = useAppDispatch();
    const panel = useAppSelector(selectPanelState);
    const pointId = useAppSelector(selectSelectedPointId);
    const isPhone = useAppSelector(selectScreenSize).innerWidth <= PHONE_BREAKPOINT;
    const { pathname } = useLocation();
    const snapshot: Snapshot = { content: panel.content, prevContent: panel.prevContent,
        settingsOpen: panel.settingsOpen, campusOpen: panel.campusOpen, restingHeight: panel.restingHeight, pointId };
    const controller = useRef<ReturnType<typeof createPanelHistory<Snapshot>> | null>(null);
    useEffect(() => {
        if (!isPhone) return;
        const history = createPanelHistory<Snapshot>(window, key, s => Boolean(
            s.settingsOpen || s.campusOpen || s.pointId
            || ![SideBarContent.Empty, SideBarContent.Institutes].includes(s.content)), s => {
            const { pointId: selected, ...panelState } = s;
            dispatch(restorePanel(panelState));
            dispatch(selected ? selectPoint(selected) : clearSelectedPoint());
        });
        controller.current = history;
        return () => { history.dispose(); controller.current = null; };
    }, [dispatch, isPhone]);
    useEffect(() => {
        const base = pathname === '/' ? SideBarContent.Institutes : SideBarContent.Empty;
        controller.current?.sync(snapshot, { content: base, prevContent: base,
            settingsOpen: false, campusOpen: false, restingHeight: 244 });
    });
}
