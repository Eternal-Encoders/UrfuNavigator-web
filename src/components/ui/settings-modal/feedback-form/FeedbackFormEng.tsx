import { Link } from "react-router-dom";

import "./feedback-form-style.css";

function FeedbackFormEng() {
    return (
        <div className="feedback-form-container">
            <p className="feedback-form-title">Are you having any problems with our site? Want to leave a comment or ask a question? Fill out this form!</p>
            <Link className="feedback-form-link" to="https://forms.yandex.ru/u/6510362502848ffde0b25c51/" target="_blank">
                Feedback Form
            </Link>
        </div>
    )
}

export default FeedbackFormEng;