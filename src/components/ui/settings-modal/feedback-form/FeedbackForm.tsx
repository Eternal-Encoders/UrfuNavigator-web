import { Link } from "react-router-dom";

import { useAppSelector } from "../../../../store/hook";
import { selectLang } from "../../../../features/lang/langSlice";
import { Languages } from "../../../../utils/interfaces";

import style from "./feedback-form-style.module.css";

function FeedbackForm() {
    const currentLanguage = useAppSelector(selectLang)

    return (
        <div className={style['feedback-form-container']}>
            <p className={style['feedback-form-title']}>
                {currentLanguage == Languages.Russian ?
                    'У вас возникли проблемы? Хотите оставить комментарий или задать вопрос? Заполните форму.':
                    'Are you having any problems with our site? Want to leave a comment or ask a question? Fill out this form!'
                }
            </p>
            <Link 
                className={style['feedback-form-link']}
                to={`https://forms.yandex.ru/u/${currentLanguage == Languages.Russian ? '64d37a5b73cee73605116cb0': '6510362502848ffde0b25c51'}/`} 
                target="_blank"
            >
                {currentLanguage == Languages.Russian ?
                    'Форма обратной связи':
                    'Feedback Form'
                }
                
            </Link>
        </div>
    )
}

export default FeedbackForm;