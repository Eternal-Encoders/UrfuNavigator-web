import backIcon from "./img/back-btn.svg";
import { useAppDispatch, useAppSelector } from "../../../../../store/hook";
import { selectPrevContent, setContent } from "../../../../../features/sideBar/sideBarSlice";

import styles from "./settings-cancel-btn-style.module.css";

function SettingsCancelBtn() {
    const dispatch = useAppDispatch()
    const prevContent = useAppSelector(selectPrevContent)

    function onClickHandler() {
        dispatch(setContent(prevContent));
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