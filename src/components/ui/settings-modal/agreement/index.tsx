import { Languages } from "../../../../utils/interfaces";
import legal from "../../../../../public/legal.pdf"

import "./agreemet-btn.css";
import { Link } from "react-router-dom";

interface AgreementBtnProps {
    currentLanguage: Languages
}

function AgreementBtn({ currentLanguage }: AgreementBtnProps) {
    return (
        <div className="agreemet-container">
            <Link className="agreemet-link" to={legal} target="_blanc">
                {currentLanguage === Languages.Russian ?
                    "Политика обработки персональных данных и Политика конфиденциальности":
                    "Personal Data Processing Policy and Privacy Policy"
                }
            </Link>
        </div>
    )
}

export default AgreementBtn;