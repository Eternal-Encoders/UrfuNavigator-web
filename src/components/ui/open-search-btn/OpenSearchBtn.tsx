import { useContext } from "react";
import { GlobalContext } from "../../../contextes/GlobalContext";
import { RouteContext } from "../../../contextes/RouteContext";
import { InstColors, PointSearchTyping } from "../../../utils/const";

import "./open-search-btn-style.css";

interface OpenSearchBtnProps {
    value: PointSearchTyping,
    isHomePage: boolean
}

const valueEng = new Map<string, string>();
valueEng.set("Откуда", "From");
valueEng.set("Куда", "To");
valueEng.set("Поиск аудиторий и мест", "Search for audiences and places");

function OpenSearchBtn({ value, isHomePage }: OpenSearchBtnProps) {
    const { setIsSearchModal, currentLanguage } = useContext(GlobalContext);
    const { setIsStartPoint,  points } = useContext(RouteContext)
    const currentPoint = points[value];

    function onClickHandler() {
        setIsSearchModal(true);
        if (value === PointSearchTyping.end || isHomePage) {
            setIsStartPoint(false)
        } else {
            setIsStartPoint(true)
        }
    }

    const color = currentPoint ? InstColors.get(currentPoint.institute) : "#CCCCCC";

    return (
        <>
            <button
                className={isHomePage ? "home-open-search-btn open-search-btn" : "open-search-btn"}
                onClick={ onClickHandler }
            >
                <div className="open-search-btn-container">
                    { isHomePage ? null : <div className="open-search-btn-circle" style={{ backgroundColor: color }}/> }
                    { currentPoint && !isHomePage ? 
                        <p className="open-search-btn-name not-like-placeholder">{ currentPoint.names.join(', ') }</p> : 
                        <p className="open-search-btn-name like-placeholder">{ currentLanguage === "english" ? valueEng.get(value) : value}</p> 
                    }
                </div>
            </button>
        </>
    )
}

export default OpenSearchBtn;