import FloorButton from "../floor-button/FloorButton";

import style from "./floors-list-style.module.css"

interface FloorsListProps {
    currentInst: string,
    firstFloor: number,
    lastFloor: number
}

function FloorsList({ currentInst, firstFloor, lastFloor }: FloorsListProps) {
    return (
        <ul className={`${style['floors-list']} flex`}>
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