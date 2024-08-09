import { useSideBarHook } from './sideBarHook';
import { PHONE_BREAKPOINT } from '../../../../utils/const';

import styles from './side-menu.module.css'
import DecorDragable from '../../decor-dragable/DecorDragable';
import { useDrawer } from '../../../../shared/hooks/DrawerHook';
import { DrawerOrient } from '../../../../utils/interfaces';

interface SideMenuProps {
}

function SideMenu({}: SideMenuProps) {
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
        <div className={styles['side-menu-conteiner']}>
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