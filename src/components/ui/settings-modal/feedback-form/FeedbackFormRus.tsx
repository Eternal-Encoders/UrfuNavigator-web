import { Link } from "react-router-dom";

import "./feedback-form-style.css";

function FeedbackFormRus() {
    return (
        <div className="feedback-form-container">
            <p className="feedback-form-title">У вас возникли проблемы? Хотите оставить комментарий или задать вопрос? Заполните форму.</p>
            <Link className="feedback-form-link" to="https://forms.yandex.ru/u/64d37a5b73cee73605116cb0/" target="_blank">
                Форма обратной связи
            </Link>
        </div>
    )
}

export default FeedbackFormRus;