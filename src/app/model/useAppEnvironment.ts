import { useEffect, useLayoutEffect, useRef } from 'react';
import { selectTheme, setScreenSize, setTheme, Theme } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

const THEME_STORAGE_KEY = 'theme';

export function useAppEnvironment() {
    const dispatch = useAppDispatch()
    const theme = useAppSelector(selectTheme);
    const themeInitialized = useRef(false);

    useEffect(() => {
        const viewport = window.visualViewport;
        let layoutWidth = window.innerWidth;
        let layoutHeight = window.innerHeight;
        let keyboardOpen = false;
        function updateScreenSize() {
            // Pinch zoom belongs to the browser; only resize the app at its normal scale.
            const visibleViewport = viewport && Math.abs(viewport.scale - 1) < 0.01 ? viewport : null;
            const visibleHeight = visibleViewport?.height ?? window.innerHeight;
            const widthChanged = window.innerWidth !== layoutWidth;
            const active = document.activeElement;
            const editing = active instanceof HTMLElement
                && active.matches('input, textarea, [contenteditable="true"]');
            const phone = window.innerWidth <= PHONE_BREAKPOINT;
            const keyboardOccludes = Math.min(visibleHeight, window.innerHeight) < layoutHeight - 1;
            keyboardOpen = phone && !widthChanged && keyboardOccludes && (editing || keyboardOpen);
            if (!keyboardOpen) {
                layoutHeight = window.innerHeight;
                layoutWidth = window.innerWidth;
            }
            // The keyboard occludes the app; it must not resize maps or the expanded drawer.
            document.documentElement.style.setProperty('--viewport-height', `${layoutHeight}px`);
            document.documentElement.style.setProperty('--visible-viewport-height', `${visibleHeight}px`);
            document.documentElement.style.setProperty('--viewport-top', `${visibleViewport?.offsetTop ?? 0}px`);
            dispatch(setScreenSize({ innerHeight: layoutHeight, innerWidth: layoutWidth }));
        }

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);
        viewport?.addEventListener('resize', updateScreenSize);
        viewport?.addEventListener('scroll', updateScreenSize);
        return () => {
            window.removeEventListener('resize', updateScreenSize);
            viewport?.removeEventListener('resize', updateScreenSize);
            viewport?.removeEventListener('scroll', updateScreenSize);
            document.documentElement.style.removeProperty('--viewport-height');
            document.documentElement.style.removeProperty('--viewport-top');
            document.documentElement.style.removeProperty('--visible-viewport-height');
        };
    }, [dispatch])

    useLayoutEffect(() => {
        if (!themeInitialized.current) {
            themeInitialized.current = true;
            const stored = localStorage.getItem(THEME_STORAGE_KEY);
            if ((stored === Theme.Dark || stored === Theme.Light) && stored !== theme) {
                dispatch(setTheme(stored));
                return;
            }
        }
        document.documentElement.classList.toggle('dark', theme === Theme.Dark);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [dispatch, theme]);

}
