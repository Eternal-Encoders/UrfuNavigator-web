import { useEffect, useLayoutEffect, useRef } from 'react';

/** Keep native carousel scrolling at progress 0 and preserve its origin during the morph. */
export function useBuildingCardMorph(progress: number, count: number) {
    const listRef = useRef<HTMLUListElement>(null);
    const compactScroll = useRef(0);
    const compactWidth = useRef(0);
    const progressRef = useRef(progress);
    progressRef.current = progress;

    function updateVisibility() {
        const list = listRef.current;
        if (!list) return;
        const width = compactWidth.current || list.clientWidth;
        list.style.setProperty('--carousel-offset', `${progressRef.current > 0 ? compactScroll.current : 0}px`);
        list.querySelectorAll<HTMLElement>('[data-building-id]').forEach((item, index) => {
            const x = 16 + index * 108 - compactScroll.current;
            item.style.setProperty('--compact-opacity', x + 100 > 0 && x < width ? '1' : '0');
        });
    }

    useLayoutEffect(() => {
        const list = listRef.current;
        if (!list) return;
        if (progress === 0) {
            compactWidth.current = list.clientWidth;
            list.scrollLeft = compactScroll.current;
        } else {
            list.scrollLeft = 0;
        }
        updateVisibility();
    }, [progress, count]);

    useEffect(() => {
        const list = listRef.current;
        if (!list) return;
        function scroll() {
            if (progressRef.current === 0) {
                compactScroll.current = list!.scrollLeft;
                compactWidth.current = list!.clientWidth;
                updateVisibility();
            }
        }
        // Returning from a collapsed panel can mount the list at width zero.
        // Re-measure once it becomes visible, even if progress/count stay unchanged.
        const observer = new ResizeObserver(() => {
            if (progressRef.current === 0 && list.clientWidth > 0) {
                compactWidth.current = list.clientWidth;
                list.scrollLeft = compactScroll.current;
                updateVisibility();
            }
        });
        observer.observe(list);
        list.addEventListener('scroll', scroll, { passive: true });
        return () => {
            observer.disconnect();
            list.removeEventListener('scroll', scroll);
        };
    }, [count]);

    return listRef;
}
