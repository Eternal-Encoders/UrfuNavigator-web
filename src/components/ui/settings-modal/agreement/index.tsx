import { Link } from "react-router-dom";

import { Languages } from "../../../../utils/interfaces";
import { useAppSelector } from "../../../../store/hook";
import { selectLang } from "../../../../features/lang/langSlice";
import legal from "../../../../../public/legal.pdf"

import style from "./agreemet-btn.module.css";

function AgreementBtn() {
    const currentLanguage = useAppSelector(selectLang)

    return (
        <div className={style.agreemetContainer}>
            <Link className={style.agreemetLink} to={legal} target="_blanc">
                {currentLanguage === Languages.Russian ?
                    "Политика обработки персональных данных и Политика конфиденциальности":
                    "Personal Data Processing Policy and Privacy Policy"
                }
            </Link>
        </div>
    )
}

export default AgreementBtn;