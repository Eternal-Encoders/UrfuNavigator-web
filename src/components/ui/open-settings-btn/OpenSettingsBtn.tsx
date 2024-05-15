import { useContext } from "react";
import { GlobalContext } from "../../../contextes/GlobalContext";

import settingsImg from './img/settings-btn.svg';
import "./open-settings-btn-style.css"

function OpneSettingsBtn() {
    const {setIsSettingsModal} = useContext(GlobalContext);

    function onSettingsBtnClick() {
        setIsSettingsModal(true)
    }

    return(
        <button className="settings-btn button" onClick={ onSettingsBtnClick }>
            <img src={ settingsImg } alt='Кнопочка настроек'/>
        </button>
    )
}

export default OpneSettingsBtn;