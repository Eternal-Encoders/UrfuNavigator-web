import { useInstituteUI } from '../../../../shared/hooks/InstitutesUIHook';
import LinkToInstitute from '../link-to-institute/LinkToInstitute';

import styles from './InstitutesUI.module.scss';


function InstitutesUI() {
    const {
        instLink,
        displayHeightModalInstitutes,
        handleTouchStart,
        handleTouchMoveModalInstitutes,
        handleTouchEndModalInstitutes
    } = useInstituteUI()

    return (
        <div className={styles['InstitutesModal']} 
            onTouchStart={ handleTouchStart }
            onTouchMove={ handleTouchMoveModalInstitutes }
            onTouchEnd={ handleTouchEndModalInstitutes }
            style={{ bottom: displayHeightModalInstitutes + 'px' }}
        >
            <div className={styles['pull-btn']} /> 
            <ul className={`${styles['institutions-list']} ${styles['list-reset']}`}> 
                {instLink.map(e => (
                    <li key={ e.name } className={styles['institutions-list-item']}>
                        <LinkToInstitute 
                            instPath={ `/institute/${e.url[0] === '/' ? e.url.slice(1): e.url}` } 
                            instName={ e.displayableName } 
                            instIcon={ `${e.icon.url}` }
                        />
                    </li>
                ))
                }
            </ul>
        </div>
    )
}

export default InstitutesUI;