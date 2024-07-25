import { selectSearchPoints } from "../../../../features/pointsSearch/pointsSearchSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { floorSet, selectFloor } from "../../../../features/floor/floorSlice";

import styles from "./floor-button-style.module.css";

interface FloorButtonProps {
    currentInst: string,
    floorNumber: number
}

function FloorButton({ currentInst, floorNumber }: FloorButtonProps) {
    const dispatch = useAppDispatch()
    const floor = useAppSelector(selectFloor)
    const points = useAppSelector(selectSearchPoints)
    
    const className = [
        styles.floorButton, 
        floor === floorNumber ? styles.active: "",
        (points.from && points.from.floor === floorNumber) && points.from.institute === currentInst || 
            (points.to && points.to.floor === floorNumber) && points.to.institute === currentInst ? 
            styles.onTheWay: 
            ""
    ];

    return (
        <li className={styles.floorElement}>
            <button 
                className={ className.join(" ") }
                value={ floorNumber } 
                onClick={ (e) => dispatch(floorSet(Number(e.currentTarget.value))) }
            >
                { floorNumber }
            </button>
        </li>
    )
}

export default FloorButton;