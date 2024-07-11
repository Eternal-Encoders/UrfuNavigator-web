import { useAppDispatch } from "../../../store/hook";
import { toggleSettingsModal } from "../../../features/modals/modalsSlice";
import settingsImg from './img/settings-btn.svg';
import style from "./open-settings-btn-style.module.css";

function OpneSettingsBtn() {
    const dispatch = useAppDispatch()

    function onSettingsBtnClick() {
        dispatch(toggleSettingsModal())
    }

    return(
        <button className={style.settingsBtnButton} onClick={ onSettingsBtnClick }>
            <img src={ settingsImg } alt='Кнопочка настроек'/>
        </button>
    )
}

export default OpneSettingsBtn;