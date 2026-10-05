import { useEffect } from 'react';
import { SideBarContent, selectContent, selectPrevContent, setContent } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { PHONE_BREAKPOINT } from '@/shared/config';
import { DrawerOrient, useAppDispatch, useAppSelector, useDrawer } from '@/shared/lib';

const MOVE_BACK_THRESHOLD = 15;
const MOVE_MAX_THRESHOLD = 110;
const MOVE_MIDDLE_THRESHOLD = 40;

const HEAD_IN_DRAWER = [
    SideBarContent.TypeList,
    SideBarContent.PointsList,
    SideBarContent.Settings
];

export function useSideMenu() {
    const dispatch = useAppDispatch();
    const content = useAppSelector(selectContent);
    const prevContent = useAppSelector(selectPrevContent);
    const { innerWidth } = useAppSelector(selectScreenSize);
    const isPhone = innerWidth <= PHONE_BREAKPOINT;

    const drawer = useDrawer(
        135,
        [135, 0.46, 0.95],
        DrawerOrient.Vertical
    );
    const { position, setPosToMin, setPosToMiddle, setPosToMax, isNearMin, isNearMiddle, isNearMax } = drawer;

    const isEmpty = content === SideBarContent.Empty;
    const isHeadInDrawer = HEAD_IN_DRAWER.includes(content);

    useEffect(() => {
        switch (content) {
        case SideBarContent.TypeList:
        case SideBarContent.PointsList:
        case SideBarContent.Settings:
            setPosToMax();
            break;
        case SideBarContent.Institutes:
            setPosToMin();
            break;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);

    useEffect(() => {
        const drawerOffset = isPhone && !isEmpty ? `${position + 12}px` : '0px';
        document.documentElement.style.setProperty('--mobile-drawer-offset', drawerOffset);

        return () => {
            document.documentElement.style.setProperty('--mobile-drawer-offset', '0px');
        };
    }, [isPhone, isEmpty, position]);

    function touchEndHandle() {
        drawer.touchEndHandle();
        if (content === SideBarContent.Institutes) {
            if (isNearMiddle(MOVE_MIDDLE_THRESHOLD)) {
                setPosToMiddle();
            }
        } else if (isNearMax(MOVE_MAX_THRESHOLD)) {
            setPosToMax();
        } else if (isNearMin(MOVE_BACK_THRESHOLD)) {
            dispatch(setContent(prevContent));
        }
    }

    return {
        content,
        isPhone,
        isEmpty,
        isHeadInDrawer,
        position,
        touchStartHandle: drawer.touchStartHandle,
        touchMoveHandle: drawer.touchMoveHandle,
        touchEndHandle
    };
}
