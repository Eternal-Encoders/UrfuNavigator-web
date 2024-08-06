import { useSideBarHook } from './sideBarHook';

import styles from './side-menu.module.css'


interface SideMenuProps {
}

function SideMenu({}: SideMenuProps) {
    const {sideBarBody, sideBarHeader} = useSideBarHook()

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