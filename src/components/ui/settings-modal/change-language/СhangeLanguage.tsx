import { useState } from "react";
import { Languages } from "../../../../utils/interfaces";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { selectLang, toggleLang } from "../../../../features/lang/langSlice";

import style from "./change-language-style.module.css";

function СhangeLanguage() {
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(selectLang)

    const [rusButton, setRusButton] = useState(currentLanguage === Languages.Russian ? true : false);
    const [engButton, setEngButton] = useState(currentLanguage === Languages.English ? true : false);

    function onHandleClick(value: Languages) {
        dispatch(toggleLang());
        if (value === Languages.Russian) {
            setRusButton(true);
            setEngButton(false);
        } else {
            setRusButton(false);
            setEngButton(true);
        }
    }

    return (
        <div className={style.changeLanguageContainer}>
            <p className={style.changeLanguageTitle}>{ currentLanguage === Languages.English ? "Language" : "Язык" }</p>
            <div className={style.changeLanguageDiv}>
                <button 
                    className={ rusButton ? style.activeRussian : style.changeLanguageButton }
                    onClick={ () => onHandleClick(Languages.Russian) }
                >
                    <p>Русский</p>
                </button>
                <button 
                    className={ engButton ? style.activeEnglish : style.changeLanguageButton }
                    onClick={ () => onHandleClick(Languages.English) }
                >
                    <p>English</p>
                </button>
            </div>
        </div>
    )
}

export default СhangeLanguage;