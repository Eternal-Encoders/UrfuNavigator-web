import { Link } from "react-router-dom";

import style from "./link-to-institute-style.module.css";

interface LinkToInstituteProps {
    instPath: string,
    instName: string,
    instIcon: string
}

function LinkToInstitute({ instPath, instIcon, instName }: LinkToInstituteProps) {
    return (
        <Link to={ instPath } className={`${style.institutionsListItemLink} flex`}>
            <button className={style.btnReset}>
                <img className={style.institutionsIcon} src={ instIcon } alt={ instName }/>
                <p className={style.institutionsName}>{ instName }</p>
            </button>
        </Link>
    );
}

export default LinkToInstitute