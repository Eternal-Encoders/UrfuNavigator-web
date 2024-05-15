import { useContext } from "react";
import { GlobalContext } from "../../../../contextes/GlobalContext";

import backIcon from "./img/back-btn.svg";
import "./settings-cancel-btn-style.css";

function SettingsCancelBtn() {
    const { setIsSettingsModal } = useContext(GlobalContext);

    function onClickHandler() {
        setIsSettingsModal(false);
    }

    return (
        <>
            <button onClick={ onClickHandler } className="back-btn">
                <img src={ backIcon } alt='Назад'/>
            </button>
        </>
    )
}

export default SettingsCancelBtn;