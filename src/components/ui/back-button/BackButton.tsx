import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RouteContext } from "../../../contextes/RouteContext";
import { PointSearchTyping } from "../../../utils/const";

import backIcon from "./img/back-btn.svg";
import "./back-button-style.css";

function BackButton() {
    const navigate = useNavigate();
    const { points, setPoints, setFloors } = useContext(RouteContext);

    function onClickHandler() {
        if (points[PointSearchTyping.start] || points[PointSearchTyping.end]) {
            setPoints({
                [PointSearchTyping.start]: undefined,
                [PointSearchTyping.end]: undefined
            })
            setFloors({'': ['']});
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <button onClick={ onClickHandler } className="back-btn">
                <img src={ backIcon } alt='Назад'/>
            </button>
        </>
    )
}

export default BackButton;