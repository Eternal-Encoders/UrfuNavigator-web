import { Link } from 'react-router-dom';


import { useTranslation } from 'react-i18next';
import style from './FeedbackForm.module.scss';

function FeedbackForm() {
    const {t, i18n} = useTranslation();

    return (
        <div className={style['FeedbackFormContainer']}>
            <p className={style['feedback-form-title']}>
                {t('AreYouHavingAnyProblemsWithOurSite')}
            </p>
            <Link 
                className={style['feedback-form-link']}
                to={`https://forms.yandex.ru/u/${i18n.resolvedLanguage === 'ru' 
                    ? 
                    '64d37a5b73cee73605116cb0'
                    : 
                    '6510362502848ffde0b25c51'}/`} 
                target="_blank"
            >
                {t('FeedbackForm')}
            </Link>
        </div>
    )
}

export default FeedbackForm;