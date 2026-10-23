import { useEffect, useRef, useState } from 'react';

/** Shared full-surface mobile dismissal for independent modal panels. */
export function useModalSwipe(open: boolean, enabled: boolean, onClose: () => void, resetKey?: string,
    options?: { expanded: boolean, onExpand: () => void, onCollapse: () => void }) {
    const [panel, panelRef] = useState<HTMLDivElement | null>(null);
    const [offset, setOffset] = useState(0);
    const [dragging, setDragging] = useState(false);
    const closeRef = useRef(onClose);
    closeRef.current = onClose;
    const optionsRef = useRef(options);
    optionsRef.current = options;
    useEffect(() => {
        if (open) { setOffset(0); setDragging(false); }
    }, [open, enabled, resetKey, options?.expanded]);
    // Wait for the portal ref to mount before attaching touch capture handlers.
    useEffect(() => {
        if (!open || !panel || !enabled) return;
        let gesture: { x: number, y: number, dy: number, swiping: boolean, scrollable: boolean } | null = null;
        function start(event: TouchEvent) {
            if (event.touches.length !== 1 || !(event.target instanceof Element)) return;
            const body = event.target.closest('.navigator-body');
            gesture = { x: event.touches[0].clientX, y: event.touches[0].clientY, dy: 0,
                swiping: false, scrollable: Boolean(body && body.scrollTop > 0) };
        }
        function move(event: TouchEvent) {
            if (!gesture || event.touches.length !== 1 || gesture.scrollable) return;
            if (window.getSelection()?.isCollapsed === false) { gesture = null; return; }
            const dx = event.touches[0].clientX - gesture.x;
            const dy = event.touches[0].clientY - gesture.y;
            if (!gesture.swiping) {
                if (Math.max(Math.abs(dx), Math.abs(dy)) < 6) return;
                if ((dy <= 0 && (!optionsRef.current || optionsRef.current.expanded)) || Math.abs(dx) > Math.abs(dy)) {
                    gesture = null; return;
                }
                gesture.swiping = true;
                setDragging(true);
            }
            event.preventDefault();
            gesture.dy = optionsRef.current ? dy : Math.max(0, dy);
            setOffset(gesture.dy);
        }
        function end(event: TouchEvent) {
            if (!gesture) return;
            if (gesture.swiping) {
                event.preventDefault();
                setDragging(false);
                if (event.type !== 'touchcancel' && Math.abs(gesture.dy) >= 32) {
                    if (gesture.dy < 0 && optionsRef.current) {
                        setOffset(0); optionsRef.current.onExpand();
                    } else if (optionsRef.current?.expanded) {
                        setOffset(0); optionsRef.current.onCollapse();
                    } else closeRef.current();
                }
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
    }, [open, panel, enabled, resetKey]);

    return { panelRef, offset, dragging };
}
