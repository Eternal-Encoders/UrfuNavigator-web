import { Link } from 'react-router-dom';

import legal from '../../../../../public/legal.pdf';

import { t } from 'i18next';
import style from './AgreementBtn.module.scss';

function AgreementBtn() {
    return (
        <div className={style['AgreementContainer']}>
            <Link className={style['agreement-link']} to={legal} target="_blanc">
                {t('PersonalDataProcessingPolicyAndPrivacyPolicy')}
            </Link>
        </div>
    )
}

export default AgreementBtn;