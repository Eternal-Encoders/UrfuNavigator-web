import { useAppDispatch } from "../../../store/hook";
import { setContent } from "../../../features/sideBar/sideBarSlice";
import { SideBarContent } from "../../../utils/interfaces";

import settingsImg from './img/settings-btn.svg';
import style from "./open-settings-btn-style.module.css";

function OpneSettingsBtn() {
    const dispatch = useAppDispatch()

    function onSettingsBtnClick() {
        dispatch(setContent(SideBarContent.Settings))
    }

    return(
        <button className={style['settings-btn']} onClick={ onSettingsBtnClick }>
            <img src={ settingsImg } alt='Кнопочка настроек'/>
        </button>
    )
}

export default OpneSettingsBtn;