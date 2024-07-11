import FloorButton from "../floor-button/FloorButton";

import { floorsList } from "./floors-list-style.module.css"

interface FloorsListProps {
    currentInst: string,
    firstFloor: number,
    lastFloor: number
}

function FloorsList({ currentInst, firstFloor, lastFloor }: FloorsListProps) {
    return (
        <ul className={`${floorsList} flex`}>
            {(() => {
                const floorsButton = [];
                for (let i=firstFloor; i <= lastFloor; i++) {
                    floorsButton.push(<FloorButton currentInst={currentInst} floorNumber={i} key={i} />);
                }
                return floorsButton;
            })()}
        </ul>
    )
}

export default FloorsList;