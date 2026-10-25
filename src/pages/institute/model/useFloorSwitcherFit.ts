import { useLayoutEffect, useRef, useState } from 'react';

/** Leave breathing room above the complete floor list; hysteresis prevents flicker. */
export function useFloorSwitcherFit() {
    const ref = useRef<HTMLDivElement>(null);
    const [hidden, setHidden] = useState(false);
    useLayoutEffect(() => {
        const container = ref.current;
        const list = container?.firstElementChild;
        if (!container || !(list instanceof HTMLElement)) return;
        const measure = () => {
            const available = container.clientHeight;
            const required = list.scrollHeight;
            setHidden(previous => available < required + (previous ? 32 : 24));
        };
        const observer = new ResizeObserver(measure);
        observer.observe(container);
        observer.observe(list);
        measure();
        return () => observer.disconnect();
    }, []);
    return { ref, hidden };
}
