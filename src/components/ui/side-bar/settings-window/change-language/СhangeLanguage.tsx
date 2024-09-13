import { Ilngs } from "../../../../../utils/interfaces";

import { useTranslation } from "react-i18next";
import { lngs } from "../../../../../shared/config/i18n/i18nLangs";
import { classNames } from "../../../../../shared/lib/classNames/classNames";
import { Button } from "../../../../../shared/ui/Button/Button";
import style from "./change-language-style.module.css";

function СhangeLanguage() {
    const {t, i18n} = useTranslation();

    return (
        <div className={style['change-language-container']}>
            <p className={style['change-language-title']}>{ t("Language") }</p>
            <div className={style['change-language-div']}>
            {Object.keys(lngs).map((lng) => (                
            <Button 
                onClick={ () => i18n.changeLanguage(lng) } 
                key={lng} 
                disabled={i18n.language === lng}
                className={classNames('', 
                    {'active-russian': 'ru' === i18n.language && lng === 'ru', 
                     'active-english': 'en' === i18n.language && lng === 'en'}, [])}
            >
                <p>{lngs[lng as keyof Ilngs]}</p>
            </Button>
        ))}
            </div>
        </div>
    )
}

export default СhangeLanguage;