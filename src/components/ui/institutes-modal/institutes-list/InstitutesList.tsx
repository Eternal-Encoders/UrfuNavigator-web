import { IInstitute } from "../../../../utils/interfaces";
import { useInstituteList } from "./InstitutesListHook";
import LinkToInstitute from "../link-to-institute/LinkToInstitute";

import style from "./institutes-list-style.module.css"

interface InstitutesModalProps {
    instLink: IInstitute[]
}

function InstitutesModal({ instLink }: InstitutesModalProps) {
    const {
        displayHeightModalInstitutes,
        handleTouchStart,
        handleTouchMoveModalInstitutes,
        handleTouchEndModalInstitutes
    } = useInstituteList()

    return (
        <div className={style.institutesModal} 
            onTouchStart={ handleTouchStart }
            onTouchMove={ handleTouchMoveModalInstitutes }
            onTouchEnd={ handleTouchEndModalInstitutes }
            style={{ bottom: displayHeightModalInstitutes + 'px' }}
        >
            <div className={style.pullBtn} /> 
            <ul className={`${style.institutionsList} ${style.listReset}`}> 
                {instLink.map(e => (
                    <li key={ e.name } className={style.institutionsListItem}>
                        <LinkToInstitute 
                            instPath={ `/institute/${e.url[0] === "/" ? e.url.slice(1): e.url}` } 
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

export default InstitutesModal;