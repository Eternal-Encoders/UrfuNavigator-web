import { InstColors } from "../../../utils/const";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectLang } from "../../../features/lang/langSlice";
import { toggleSearchModal } from "../../../features/modals/modalsSlice";
import { Languages } from "../../../utils/interfaces";
import { selectSearchPoints } from "../../../features/pointsSearch/pointsSearchSlice";

import style from "./open-search-btn-style.module.css";

interface OpenSearchBtnProps {
    isEnd: boolean,
    isHomePage?: boolean,
    setIsStartPressed?: (isStartPressed: boolean) => void 
}

function OpenSearchBtn({ isEnd, isHomePage, setIsStartPressed }: OpenSearchBtnProps) {
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(selectLang)
    const points = useAppSelector(selectSearchPoints)

    const currentPoint = isEnd || isHomePage ? points.to: points.from;
    const color = currentPoint ? InstColors.get(currentPoint.institute) : "#CCCCCC";

    let text = ''
    if (isHomePage) {
        text = currentLanguage === Languages.English ? "Search for audiences and places": "Поиск аудиторий и мест"
    } else if (isEnd) {
        text = currentLanguage === Languages.English ? "To": "Куда"
    } else {
        text = currentLanguage === Languages.English ? "From": "Откуда"
    }

    function onClickHandler() {
        dispatch(toggleSearchModal());
        if (setIsStartPressed) {
            setIsStartPressed(!isEnd)
        }
    }

    return (
        <>
            <button
                className={isHomePage ? 
                    `${style.homeOpenSearchBtn} ${style.openSearchBtn}` : 
                    style.openSearchBtn
                }
                onClick={ onClickHandler }
            >
                <div className={style.openSearchBtnContainer}>
                    {isHomePage ? 
                        null : 
                        <div className={style.openSearchBtnCircle} style={{ backgroundColor: color }}/> 
                    }
                    {currentPoint ? 
                        <p className={`${style.openSearchBtnName} ${style.notLikePlaceholder}`}>
                            { currentPoint.names.join(', ') }
                        </p> : 
                        <p className={`${style.openSearchBtnName} ${style.likePlaceholder}`}>
                            { text }
                        </p> 
                    }
                </div>
            </button>
        </>
    )
}

export default OpenSearchBtn;