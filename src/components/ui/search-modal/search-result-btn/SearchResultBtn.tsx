import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { selectSearchPoints, setFromPoint, setToPoint } from "../../../../features/pointsSearch/pointsSearchSlice";
import { toggleSearchModal } from "../../../../features/modals/modalsSlice";
import { floorSet } from "../../../../features/floor/floorSlice";
import { IGraphPoint } from "../../../../utils/interfaces";
import { InstColors } from "../../../../utils/const";
import { InstLinks } from "../../../../utils/const";

import style from "./search-result-btn-style.module.css";

interface SearchResultBtnProps {
    data: IGraphPoint,
    isStartPressed: boolean
}

function SearchResultBtn({ data, isStartPressed }: SearchResultBtnProps) {
    const dispatch = useAppDispatch()
    const points = useAppSelector(selectSearchPoints)
    const navigate = useNavigate();

    function onClickHandler() {
        const link = InstLinks.get(data.institute);
        if (isStartPressed) {
            dispatch(setFromPoint(data))
        } else {
            dispatch(setToPoint(data))
        }
        dispatch(toggleSearchModal())

        if (link && (window.location.pathname === "/" || isStartPressed || !points.from)) {
            navigate(`/institute${link}`);
            dispatch(floorSet(data.floor))
        }
    }

    return (
        <li>
            <button className={style.searchResultBtn} onClick={ onClickHandler }>
                <p className={style.searchResultBtnName}>{ data.names.join(', ') }</p>
                <div className={style.searchResultAddition}>
                    <div className={style.searchResultAdditionImg} style={{ backgroundColor: InstColors.get(data.institute) }}/>
                    <p className={style.searchResultAdditionName}>{ data.institute }</p>
                </div>
            </button>
        </li>
    )
}

export default SearchResultBtn;