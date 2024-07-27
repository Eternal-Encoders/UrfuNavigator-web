import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { selectSearchPoints, setPoints } from "../../../features/pointsSearch/pointsSearchSlice";
import backIcon from "./img/back-btn.svg";

import style from "./back-button-style.module.css";

function BackButton() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    const points = useAppSelector(selectSearchPoints)

    function onClickHandler() {
        if (points.from || points.to) {
            dispatch(setPoints({
                from: undefined,
                to: undefined
            }))
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <button onClick={ onClickHandler } className={style['back-btn']}>
                <img src={ backIcon } alt='Назад'/>
            </button>
        </>
    )
}

export default BackButton;