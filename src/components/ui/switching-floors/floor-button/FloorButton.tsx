import { useContext } from "react";
import { MapContext } from "../../../../contextes/MapContext";
import { RouteContext } from "../../../../contextes/RouteContext";
import { PointSearchTyping } from "../../../../utils/const";

import "./floor-button-style.css";

interface FloorButtonProps {
    currentInst: string,
    floorNumber: number
}

function FloorButton({ currentInst, floorNumber }: FloorButtonProps) {
    const { currentFloor, setCurrentFloor } = useContext(MapContext);
    const { points, floors } = useContext(RouteContext);
    
    const className = [
        "floor-button", 

        currentFloor === floorNumber ? "active": "",

        (points[PointSearchTyping.start] && points[PointSearchTyping.start].floor === floorNumber) && points[PointSearchTyping.start].institute === currentInst || 
            (points[PointSearchTyping.end] && points[PointSearchTyping.end].floor === floorNumber) && points[PointSearchTyping.end].institute === currentInst ||
                floors[currentInst]?.includes(floorNumber.toString()) ? 
                    "on-the-way": ""
    ];

    return (
        <li className="floor-element">
            <button 
                className={ className.join(" ") }
                // style={currentFloor === floorNumber ? activeStyles :nonActiveStyles}
                value={ floorNumber } 
                onClick={ (e) => setCurrentFloor(Number(e.currentTarget.value)) }
            >
                { floorNumber }
            </button>
        </li>
    )
}

export default FloorButton;