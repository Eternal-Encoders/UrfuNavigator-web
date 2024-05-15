import { useContext } from "react";
import { GlobalContext } from "../../../../contextes/GlobalContext";

import cancelBtn from "./img/cancel-btn.svg";
import "./back-button-style.css";

interface SearchCancelBtnProps {
    name: string,
    onClick: () => void
}

function SearchCancelBtn({ name, onClick }: SearchCancelBtnProps) {
    const { setIsSearchModal } = useContext(GlobalContext);

    function onClickHandler() {
        if (name) {
            onClick()
        } else {
            setIsSearchModal(false)
        }
    }

    return (
        <>
            <button onClick={onClickHandler}>
                <img src={ cancelBtn } alt='Назад'/>
            </button>
        </>
    )
}

export default SearchCancelBtn;