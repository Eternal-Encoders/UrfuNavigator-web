import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { selectSettingsOpen, setSettingsOpen } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

export function useSettingsSwipe() {
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectSettingsOpen);
    const { innerWidth } = useAppSelector(selectScreenSize);
    const isPhone = innerWidth <= PHONE_BREAKPOINT;
    const { pathname } = useLocation();
    const [panel, panelRef] = useState<HTMLDivElement | null>(null);
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const previousPath = useRef(pathname);

    useEffect(() => {
        if (previousPath.current !== pathname) dispatch(setSettingsOpen(false));
        previousPath.current = pathname;
    }, [dispatch, pathname]);

    useEffect(() => {
        if (open) {
            setOffset(0);
            setDragging(false);
        }
    }, [open, isPhone]);

    // Wait for the portal ref to mount before attaching touch capture handlers.
    useEffect(() => {
        if (!open || !panel || !isPhone) return;
        let gesture: { x: number, y: number, dy: number, swiping: boolean, scrollable: boolean } | null = null;
        function start(event: TouchEvent) {
            if (event.touches.length !== 1 || !(event.target instanceof Element)) return;
            const body = event.target.closest('.navigator-body');
            gesture = { x: event.touches[0].clientX, y: event.touches[0].clientY, dy: 0,
                swiping: false, scrollable: Boolean(body && body.scrollTop > 0) };
        }
        function move(event: TouchEvent) {
            if (!gesture || event.touches.length !== 1 || gesture.scrollable) return;
            const dx = event.touches[0].clientX - gesture.x;
            const dy = event.touches[0].clientY - gesture.y;
            if (!gesture.swiping) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
                if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) { gesture = null; return; }
                gesture.swiping = true;
                setDragging(true);
            }
            event.preventDefault();
            gesture.dy = Math.max(0, dy);
            setOffset(gesture.dy);
        }
        function end(event: TouchEvent) {
            if (!gesture) return;
            if (gesture.swiping) {
                event.preventDefault();
                setDragging(false);
                if (event.type !== 'touchcancel' && gesture.dy >= 32) dispatch(setSettingsOpen(false));
                else setOffset(0);
            }
            gesture = null;
        }
        panel.addEventListener('touchstart', start, { capture: true, passive: true });
        panel.addEventListener('touchmove', move, { capture: true, passive: false });
        panel.addEventListener('touchend', end, { capture: true, passive: false });
        panel.addEventListener('touchcancel', end, true);
        return () => {
            panel.removeEventListener('touchstart', start, true);
            panel.removeEventListener('touchmove', move, true);
            panel.removeEventListener('touchend', end, true);
            panel.removeEventListener('touchcancel', end, true);
        };
    }, [dispatch, open, panel, isPhone]);

    return { open, panelRef, offset, dragging, onOpenChange: (value: boolean) => dispatch(setSettingsOpen(value)) };
}
