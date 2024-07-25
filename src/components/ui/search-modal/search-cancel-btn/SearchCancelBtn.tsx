import { useAppDispatch } from "../../../../store/hook";
import { toggleSearchModal } from "../../../../features/modals/modalsSlice";
import cancelBtn from "./img/cancel-btn.svg";
import style from "./back-button-style.module.css";

interface SearchCancelBtnProps {
    name: string,
    onClick: () => void
}

function SearchCancelBtn({ name, onClick }: SearchCancelBtnProps) {
    const dispatch = useAppDispatch()

    function onClickHandler() {
        if (name) {
            onClick()
        } else {
            dispatch(toggleSearchModal())
        }
    }

    return (
        <>
            <button className={style.backBtn} onClick={ onClickHandler }>
                <img src={ cancelBtn } alt='Назад'/>
            </button>
        </>
    )
}

export default SearchCancelBtn;