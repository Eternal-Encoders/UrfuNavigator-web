import React,  { useContext } from "react";
import { GlobalContext } from "../../../../contextes/GlobalContext";
import СhangeLanguage from "../change-language/СhangeLanguage"
import FeedbackFormEng from "../feedback-form/FeedbackFormEng";
import FeedbackFormRus from "../feedback-form/FeedbackFormRus";
import Contacts from "../contacts/Contacts";
import SettingsCancelBtn from "../settings-cancel-btn/SettingsCancelBtn";
import AgreementBtn from "../agreement";
import { Languages } from "../../../../utils/interfaces";

import "./settings-ui-style.css";

function SettingsModal() {
    const { setIsSettingsModal, currentLanguage } = useContext(GlobalContext);

    const paddingRelativeScreenWidth = window.screen.width > 1200 ? 0 : 5;
    const [displayHeight, setdisplayHeight] = React.useState(paddingRelativeScreenWidth);
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);

    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        setTouchStart(e.targetTouches[0].clientY);
    }

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.targetTouches[0].clientY);
        if (touchStart - touchEnd > 0) {
            setdisplayHeight(5)
        } else {
            setdisplayHeight((e.targetTouches[0].clientY * 100) /  window.screen.height)
        }
    }

    function handleTouchEnd() {
        setdisplayHeight(paddingRelativeScreenWidth)
        if (touchStart - touchEnd < -30) {
            setIsSettingsModal(false);
        } 
    }

    return (
        <div className="settings-container modal-window"
            onTouchStart={ (e) => handleTouchStart(e) }
            onTouchMove={ (e) => handleTouchMove(e) }
            onTouchEnd={ () => handleTouchEnd() }
            style={{ top: displayHeight + '%' }}
        >
            <div className="pull-btn"/>
            <div className="settings-head">
                <div className="settings-title">
                    <p className="settings-title-text">{ currentLanguage === Languages.English ? "Settings" : "Настройки" }</p>
                </div>
                <SettingsCancelBtn/>
            </div>
            <СhangeLanguage/>
            { currentLanguage === Languages.English ? 
                <FeedbackFormEng/> : 
                <FeedbackFormRus/> }
            <Contacts/>
            <AgreementBtn currentLanguage={currentLanguage} />
        </div>
    )
}

export default SettingsModal;