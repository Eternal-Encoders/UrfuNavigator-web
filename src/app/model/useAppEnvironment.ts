import { useEffect } from 'react';
import { selectTheme, setScreenSize, setTheme, Theme } from '@/entities/viewer';
import { useAppDispatch, useAppSelector } from '@/shared/lib';

const THEME_STORAGE_KEY = 'theme';

export function useAppEnvironment() {
    const dispatch = useAppDispatch()
    const theme = useAppSelector(selectTheme);

    useEffect(() => {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme === Theme.Dark || storedTheme === Theme.Light) {
            dispatch(setTheme(storedTheme));
        }

        function updateScreenSize() {
            dispatch(setScreenSize({
                innerHeight: window.innerHeight,
                innerWidth: window.innerWidth
            }))
        }

        window.addEventListener('resize', updateScreenSize)
        return () => {
            window.removeEventListener('resize', updateScreenSize)
        }
    }, [dispatch])

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === Theme.Dark);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        const viewport = window.visualViewport;
        if (!viewport) {
            return;
        }

        const updateKeyboardOffset = () => {
            const keyboardOffset = Math.max(
                0,
                window.innerHeight - viewport.height - viewport.offsetTop
            );
            document.documentElement.style.setProperty('--keyboard-offset', `${keyboardOffset}px`);
        };

        updateKeyboardOffset();
        viewport.addEventListener('resize', updateKeyboardOffset);
        viewport.addEventListener('scroll', updateKeyboardOffset);

        return () => {
            viewport.removeEventListener('resize', updateKeyboardOffset);
            viewport.removeEventListener('scroll', updateKeyboardOffset);
            document.documentElement.style.setProperty('--keyboard-offset', '0px');
        };
    }, []);
}
