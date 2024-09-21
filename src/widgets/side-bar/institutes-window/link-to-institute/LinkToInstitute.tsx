import { Link } from 'react-router-dom';

import style from './LinkToInstitute.module.scss';

interface LinkToInstituteProps {
    instPath: string,
    instName: string,
    instIcon: string
}

function LinkToInstitute({ instPath, instIcon, instName }: LinkToInstituteProps) {
    const urlOrigin = import.meta.env.VITE_HOST 
        ? 
        `https://${import.meta.env.VITE_HOST}` 
        : 
        'https://dev.how-to-navigate.ru/api'

    return (
        <Link to={ instPath } className={`${style['InstitutionsListItemLink']} flex`}>
            <button className={style['btn-reset']}>
                <img className={style['institutions-icon']} src={ `${urlOrigin}/icons/${instIcon}` } alt={ instName }/>
                <p className={style['institutions-name']}>{ instName }</p>
            </button>
        </Link>
    );
}

export default LinkToInstitute