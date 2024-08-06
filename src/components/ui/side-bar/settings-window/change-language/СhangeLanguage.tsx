import { useState } from "react";
import { Languages } from "../../../../../utils/interfaces";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { selectLang, setLang } from "../../../../../features/lang/langSlice";

import style from "./change-language-style.module.css";

function СhangeLanguage() {
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(selectLang)

    const [rusButton, setRusButton] = useState(currentLanguage === Languages.Russian ? true : false);
    const [engButton, setEngButton] = useState(currentLanguage === Languages.English ? true : false);

    function onHandleClick(value: Languages) {
        if (value === Languages.Russian) {
            setRusButton(true);
            setEngButton(false);
            dispatch(setLang(Languages.Russian));
        } else {
            setRusButton(false);
            setEngButton(true);
            dispatch(setLang(Languages.English));
        }
    }

    return (
        <div className={style['change-language-container']}>
            <p className={style['change-language-title']}>{ currentLanguage === Languages.English ? "Language" : "Язык" }</p>
            <div className={style['change-language-div']}>
                <button 
                    className={ rusButton ? style['active-russian'] : style['change-language-button'] }
                    onClick={ () => onHandleClick(Languages.Russian) }
                >
                    <p>Русский</p>
                </button>
                <button 
                    className={ engButton ? style['active-english'] : style['change-language-button'] }
                    onClick={ () => onHandleClick(Languages.English) }
                >
                    <p>English</p>
                </button>
            </div>
        </div>
    )
}

export default СhangeLanguage;