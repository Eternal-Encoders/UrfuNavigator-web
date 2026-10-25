import { useEffect, useRef, useState } from 'react';
import { createHaptic } from './haptic';

const PULL_DISTANCE = 144;
const AXIS_THRESHOLD = 6;

/** Native horizontal scrolling first; a separate pull past its end opens the catalog. */
export function useCarouselEndPull(
    enabled: boolean, onOpen: () => void, externalRef?: { current: HTMLUListElement | null }
) {
    const internalRef = useRef<HTMLUListElement>(null);
    const listRef = externalRef ?? internalRef;
    const openRef = useRef(onOpen);
    openRef.current = onOpen;
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const list = listRef.current;
        if (!enabled || !list) { setProgress(0); return; }
        const haptic = createHaptic();
        let gesture: { x: number, y: number, axis: 'pending' | 'horizontal' | 'vertical', edgeX: number | null } | null = null;
        let pull = 0;
        let pulsed = false;
        let visualProgress = 0;
        let returnFrame = 0;
        let suppressClickUntil = 0;
        const atEnd = () => list.scrollLeft >= list.scrollWidth - list.clientWidth - 2;
        function paint(value: number) { visualProgress = value; setProgress(value); }
        function reset(animate = false) {
            gesture = null;
            pull = 0;
            cancelAnimationFrame(returnFrame);
            returnFrame = 0;
            if (!animate || visualProgress <= 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                paint(0);
                return;
            }
            const from = visualProgress;
            const started = performance.now();
            function tick(now: number) {
                const time = Math.min(1, Math.max(0, (now - started) / 260));
                paint(from * (1 - time) ** 3);
                if (time < 1) returnFrame = requestAnimationFrame(tick);
                else returnFrame = 0;
            }
            returnFrame = requestAnimationFrame(tick);
        }
        function start(event: TouchEvent) {
            reset();
            pulsed = false;
            if (event.touches.length !== 1) return;
            const { clientX: x, clientY: y } = event.touches[0];
            gesture = { x, y, axis: 'pending', edgeX: atEnd() ? x : null };
        }
        function move(event: TouchEvent) {
            if (!gesture) return;
            if (event.touches.length !== 1) { reset(true); return; }
            const { clientX: x, clientY: y } = event.touches[0];
            if (gesture.axis === 'pending') {
                const dx = x - gesture.x, dy = y - gesture.y;
                if (Math.max(Math.abs(dx), Math.abs(dy)) < AXIS_THRESHOLD) return;
                gesture.axis = Math.abs(dx) > Math.abs(dy) ? 'horizontal' : 'vertical';
            }
            if (gesture.axis !== 'horizontal') return;
            if (!atEnd()) { gesture.edgeX = null; pull = 0; paint(0); return; }
            // Scrolling into the edge consumes no pull distance; only movement after it counts.
            if (gesture.edgeX === null) gesture.edgeX = x;
            pull = Math.max(0, gesture.edgeX - x);
            if (pull <= 0) { paint(0); return; }
            event.preventDefault();
            suppressClickUntil = Date.now() + 800;
            cancelAnimationFrame(returnFrame);
            paint(Math.min(1, pull / PULL_DISTANCE));
            if (pull >= PULL_DISTANCE && !pulsed) {
                pulsed = true;
                haptic.pulse(event);
            }
        }
        function end(event: TouchEvent) {
            const open = event.type !== 'touchcancel' && pull >= PULL_DISTANCE;
            if (pull > 0) event.preventDefault();
            reset(!open);
            if (open) openRef.current();
        }
        function click(event: MouseEvent) {
            if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopPropagation(); }
        }
        list.addEventListener('touchstart', start, { passive: true });
        list.addEventListener('touchmove', move, { passive: false });
        list.addEventListener('touchend', end, { passive: false });
        list.addEventListener('touchcancel', end);
        list.addEventListener('click', click, true);
        return () => {
            haptic.dispose();
            cancelAnimationFrame(returnFrame);
            list.removeEventListener('touchstart', start);
            list.removeEventListener('touchmove', move);
            list.removeEventListener('touchend', end);
            list.removeEventListener('touchcancel', end);
            list.removeEventListener('click', click, true);
        };
    }, [enabled, listRef]);
    return { listRef, progress };
}
