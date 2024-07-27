import { Link } from "react-router-dom";

import style from "./link-to-institute-style.module.css";

interface LinkToInstituteProps {
    instPath: string,
    instName: string,
    instIcon: string
}

function LinkToInstitute({ instPath, instIcon, instName }: LinkToInstituteProps) {
    const urlOrigin = import.meta.env.VITE_HOST ? `https://${import.meta.env.VITE_HOST}` : 'https://dev.how-to-navigate.ru/api'

    return (
        <Link to={ instPath } className={`${style.institutionsListItemLink} flex`}>
            <button className={style.btnReset}>
                <img className={style.institutionsIcon} src={ `${urlOrigin}/icons/${instIcon}` } alt={ instName }/>
                <p className={style.institutionsName}>{ instName }</p>
            </button>
        </Link>
    );
}

export default LinkToInstitute