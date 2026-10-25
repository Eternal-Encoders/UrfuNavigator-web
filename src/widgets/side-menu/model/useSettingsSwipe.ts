import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { selectSettingsOpen, setSettingsOpen } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { useAppDispatch, useAppSelector, useModalSwipe } from '@/shared/lib';

export function useSettingsSwipe() {
    const dispatch = useAppDispatch();
    const open = useAppSelector(selectSettingsOpen);
    const { innerWidth } = useAppSelector(selectScreenSize);
    const isPhone = innerWidth <= PHONE_BREAKPOINT;
    const { pathname } = useLocation();
    const previousPath = useRef(pathname);

    useEffect(() => {
        if (previousPath.current !== pathname) dispatch(setSettingsOpen(false));
        previousPath.current = pathname;
    }, [dispatch, pathname]);

    const { panelRef, offset, dragging } = useModalSwipe(open, isPhone, () => dispatch(setSettingsOpen(false)));

    return { open, panelRef, offset, dragging, onOpenChange: (value: boolean) => dispatch(setSettingsOpen(value)) };
}
