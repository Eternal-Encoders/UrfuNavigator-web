

import { setContent } from '../../features/sideBar/sideBarSlice';
import settingsImg from '../../shared/assets/icons/settings-btn.svg';
import { useAppDispatch } from '../../store/hook';
import { SideBarContent } from '../../utils/interfaces';
import style from './OpenSettingsBtn.module.scss';

function OpneSettingsBtn() {
    const dispatch = useAppDispatch()

    function onSettingsBtnClick() {
        dispatch(setContent(SideBarContent.Settings))
    }

    return(
        <button className={style['SettingsBtn']} onClick={ onSettingsBtnClick }>
            <img src={ settingsImg } alt='Кнопочка настроек'/>
        </button>
    )
}

export default OpneSettingsBtn;