import backIcon from "./img/back-btn.svg";
import { useAppDispatch } from "../../../../store/hook";
import { toggleSettingsModal } from "../../../../features/modals/modalsSlice";

import styles from "./settings-cancel-btn-style.module.css";

function SettingsCancelBtn() {
    const dispatch = useAppDispatch()

    function onClickHandler() {
        dispatch(toggleSettingsModal());
    }

    return (
        <>
            <button onClick={ onClickHandler } className={styles['back-btn']}>
                <img src={ backIcon } alt='Назад'/>
            </button>
        </>
    )
}

export default SettingsCancelBtn;