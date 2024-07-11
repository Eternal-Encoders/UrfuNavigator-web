import React from "react";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { selectLang } from "../../../../features/lang/langSlice";
import { toggleSettingsModal } from "../../../../features/modals/modalsSlice";
import { Languages } from "../../../../utils/interfaces";
import СhangeLanguage from "../change-language/СhangeLanguage"
import Contacts from "../contacts/Contacts";
import SettingsCancelBtn from "../settings-cancel-btn/SettingsCancelBtn";
import AgreementBtn from "../agreement";

import styles from "./settings-ui-style.module.css";
import FeedbackForm from "../feedback-form/FeedbackForm";

function SettingsModal() {
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(selectLang)

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
            dispatch(toggleSettingsModal());
        } 
    }

    return (
        <div className="settings-container modal-window"
            onTouchStart={ (e) => handleTouchStart(e) }
            onTouchMove={ (e) => handleTouchMove(e) }
            onTouchEnd={ () => handleTouchEnd() }
            style={{ top: displayHeight + '%' }}
        >
            <div className={styles.pullBtn}/>
            <div className={styles.settingsHead}>
                <div className={styles.settingsTitle}>
                    <p className={styles.settingsTitleText}>{ currentLanguage === Languages.English ? "Settings" : "Настройки" }</p>
                </div>
                <SettingsCancelBtn/>
            </div>
            <СhangeLanguage/>
            <FeedbackForm />
            <Contacts/>
            <AgreementBtn />
        </div>
    )
}

export default SettingsModal;