
import { useDrawer } from '../../../shared/hooks/DrawerHook';
import { useSideBarHook } from '../../../shared/hooks/sideBarHook';
import { PHONE_BREAKPOINT } from '../../../utils/const';
import { DrawerOrient } from '../../../utils/interfaces';
import DecorDragable from '../../decor-dragable/DecorDragable';
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

    if (window.innerWidth <= PHONE_BREAKPOINT) {
        return (
            <>
                {!isHeadInDrawer &&
                    <div className={styles['side-menu-header']}>
                        { sideBarHeader }
                    </div>
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
                        style={{
                            height: position
                        }}
                    >
                        <DecorDragable />
                        {isHeadInDrawer &&
                            <div className={styles['side-menu-header']}>
                                { sideBarHeader }
                            </div>
                        }
                        { sideBarBody }
                    </div>
                }
                
            </>
        );
    }
    return (
        <div className={styles['SideMenuContainer']}>
            <div className={styles['side-menu-header']}>
                { sideBarHeader }
            </div>
            <div className={styles['side-menu-body']}>
                { sideBarBody }
            </div>
        </div>
    );
}

export default SideMenu