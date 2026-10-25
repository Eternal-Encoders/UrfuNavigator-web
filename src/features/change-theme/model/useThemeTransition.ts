import { useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { selectTheme, setTheme, Theme } from '@/entities/viewer';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

/** Reveal the new, fully rendered theme instead of transitioning individual colors. */
export function useThemeTransition() {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);
    const active = useRef<ViewTransition | null>(null);

    useEffect(() => () => {
        active.current?.skipTransition();
        active.current = null;
        document.documentElement.classList.remove('theme-transition');
    }, []);

    async function changeTheme(value: Theme, button: HTMLElement) {
        if (value === theme) return;
        active.current?.skipTransition();
        const root = document.documentElement;
        const apply = () => flushSync(() => dispatch(setTheme(value)));
        if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            apply();
            return;
        }
        const bounds = button.getBoundingClientRect();
        const x = bounds.left + bounds.width / 2;
        const y = bounds.top + bounds.height / 2;
        const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        root.classList.add('theme-transition');
        const transition = document.startViewTransition(apply);
        active.current = transition;
        try {
            await transition.ready;
            if (active.current !== transition) return;
            const reveal = root.animate({
                clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
            }, { duration: 450, easing: 'cubic-bezier(0.2, 0, 0, 1)', pseudoElement: '::view-transition-new(root)' });
            await reveal.finished;
            await transition.finished;
        } catch {
            // Skipping, reduced motion, or unavailable snapshots still applies the theme.
        } finally {
            if (active.current === transition) {
                active.current = null;
                root.classList.remove('theme-transition');
            }
        }
    }

    return { theme, changeTheme };
}
