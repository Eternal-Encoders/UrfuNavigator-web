import { useRef } from "react";

import SearchList from "../search-list/SearchList";
import QuickTipsList from "../quick-tips/quick-tips-list/QuickTipsList";
import SearchCancelBtn from "../search-cancel-btn/SearchCancelBtn";
import searchImg from "./img/seacrh-img.svg"
import { useAppSelector } from "../../../../store/hook";
import { selectLang } from "../../../../features/lang/langSlice";
import { useSearchUi } from "./SearchUiHook";
import { Languages } from "../../../../utils/interfaces";

import style from "./search-ui-style.module.css";

interface SearchModalProps {
    isStartPressed: boolean
}

function SearchModal({ isStartPressed }: SearchModalProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const currentLanguage = useAppSelector(selectLang);
    const {
        displayHeight,
        name,
        type,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        onNameChange,
        onCancelBtnClick,
        onTipClick
    } = useSearchUi(inputRef);

    return (
        <div className={`container modal-window ${style.searchContainer}`}
            onTouchStart={ (e) => handleTouchStart(e) }
            onTouchMove={ (e) => handleTouchMove(e) }
            onTouchEnd={ () => handleTouchEnd() }
            style={{ top: displayHeight + '%', height: window.screen.height }}
        >
            <div className={style.pullBtn} />
            <div className={style.modalSearchInputDiv}>
                <img src={ searchImg } alt='Поиск'/>
                <input type="text"
                    ref={ inputRef }
                    className={style.pointsSearchInput}
                    value={ name }
                    placeholder={ currentLanguage === Languages.English ? "Search for audiences and places" : "Поиск аудиторий и мест" }
                    onChange={ (e) => onNameChange(e) }
                />
                <SearchCancelBtn name={ name } onClick={ onCancelBtnClick }/>
            </div>
            {name === "" ? 
                <QuickTipsList onClick={ onTipClick }/> : 
                <SearchList name={ name } type={ type } isStartPressed={isStartPressed} />
            }
        </div>
    )
}

export default SearchModal;