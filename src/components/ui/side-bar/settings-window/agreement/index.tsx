import { Link } from "react-router-dom";

import legal from "../../../../../../public/legal.pdf";

import { t } from "i18next";
import style from "./agreemet-btn.module.css";

function AgreementBtn() {
    return (
        <div className={style['agreemet-container']}>
            <Link className={style['agreemet-link']} to={legal} target="_blanc">
                {t('PersonalDataProcessingPolicyAndPrivacyPolicy')}
            </Link>
        </div>
    )
}

export default AgreementBtn;