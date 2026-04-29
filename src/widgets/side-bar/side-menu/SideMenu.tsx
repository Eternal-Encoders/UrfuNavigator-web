import { useEffect } from 'react';
import { selectScreenSize } from '../../../features/rootData/rootDataSlice';
import { useDrawer } from '../../../shared/hooks/DrawerHook';
import { useSideBarHook } from '../../../shared/hooks/sideBarHook';
import { useAppSelector } from '../../../store/hook';
import { PHONE_BREAKPOINT } from '../../../utils/const';
import { DrawerOrient } from '../../../utils/interfaces';
import DecorDragable from '../../decor-dragable/DecorDragable';
import { Panel } from '../../../shared/ui/Panel/Panel';
import styles from './SideMenu.module.scss';

// interface SideMenuProps {
// }

function SideMenu() {
    const {
        position,
        touchStartHandle,
        touchMoveHandle,
        touchEndHandle,
        setPosToMin,
        setPosToMiddle,
        setPosToMax,
        isNearMin,
        isNearMiddle,
        isNearMax
    } = useDrawer(
        135,
        [135, 0.46, 0.95],
        DrawerOrient.Vertical
    );

    const {
        sideBarBody, 
        sideBarHeader,
        isEmpty,
        isHeadInDrawer,
        sideTouchEndHandle
    } = useSideBarHook(
        setPosToMin,
        setPosToMiddle,
        setPosToMax,
        isNearMin,
        isNearMiddle,
        isNearMax
    );

    const { innerWidth } = useAppSelector(selectScreenSize)
    const isPhone = innerWidth <= PHONE_BREAKPOINT;

    useEffect(() => {
        const drawerOffset = isPhone && !isEmpty ? `${position + 12}px` : '0px';
        document.documentElement.style.setProperty('--mobile-drawer-offset', drawerOffset);

        return () => {
            document.documentElement.style.setProperty('--mobile-drawer-offset', '0px');
        };
    }, [isPhone, isEmpty, position]);

    if (isPhone) {
        return (
            <>
                {!isHeadInDrawer &&
                    <Panel className={styles['side-menu-header']} elevated>
                        { sideBarHeader }
                    </Panel>
                }
                {!isEmpty &&
                    <div 
                        className={styles['side-menu-body']}
                        onTouchStart={touchStartHandle}
                        onTouchMove={touchMoveHandle}
                        onTouchEnd={() => {
                            touchEndHandle();
                            sideTouchEndHandle();
                        }}
                        role="dialog"
                        aria-modal="false"
                        style={{
                            height: position
                        }}
                    >
                        <DecorDragable />
                        {isHeadInDrawer &&
                            <Panel className={styles['side-menu-header']} elevated>
                                { sideBarHeader }
                            </Panel>
                        }
                        { sideBarBody }
                    </div>
                }
                
            </>
        );
    }
    return (
        <div className={styles['SideMenuContainer']}>
            <Panel className={styles['side-menu-header']} elevated>
                { sideBarHeader }
            </Panel>
            <div className={styles['side-menu-body']}>
                { sideBarBody }
            </div>
        </div>
    );
}

export default SideMenu