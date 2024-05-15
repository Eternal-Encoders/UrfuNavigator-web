import { useContext, useState } from "react";
import { GlobalContext } from "../../../../contextes/GlobalContext";
import "./change-language-style.css";
import { Languages } from "../../../../utils/interfaces";

function СhangeLanguage() {
    const { currentLanguage, setCurrentLanguage } = useContext(GlobalContext);

    const [rusButton, setRusButton] = useState(currentLanguage === Languages.Russian ? true : false);
    const [engButton, setEngButton] = useState(currentLanguage === Languages.English ? true : false);

    function onHandleClick(value: Languages) {
        setCurrentLanguage(value);
        if (value === Languages.Russian) {
            setRusButton(true);
            setEngButton(false);
        } else {
            setRusButton(false);
            setEngButton(true);
        }
    }

    return (
        <div className="change-language-container">
            <p className="change-language-title">{ currentLanguage === Languages.English ? "Language" : "Язык" }</p>
            <div className="change-language-div">
                <button 
                    className={ rusButton ? "active-russian" : "change-language-button" }
                    onClick={ () => onHandleClick(Languages.Russian) }
                >
                    <p>Русский</p>
                </button>
                <button 
                    className={ engButton ? "active-english" : "change-language-button" }
                    onClick={ () => onHandleClick(Languages.English) }
                >
                    <p>English</p>
                </button>
            </div>
        </div>
    )
}

export default СhangeLanguage;