import { useState } from "react";
import { useAppSelector } from "../../../store/hook";
import { selectSearchModal } from "../../../features/modals/modalsSlice";
import { selectFromPoint, selectToPoint } from "../../../features/pointsSearch/pointsSearchSlice";
import BackButton from "../back-button/BackButton";
import FloorsList from "../switching-floors/floors-list/FloorsList";
import OpenSearchBtn from "../open-search-btn/OpenSearchBtn";
import SearchModal from "../search-modal/search-ui/SearchUi";
import RedirectInstitute from "../switching-institutions/redirect-institute/redirect-institute";

import style from "./map-ui-style.module.css";

interface MapUIProps {
    instFullName: string,
    firstFloor: number,
    lastFloor: number
}

function MapUI({ instFullName, firstFloor, lastFloor }: MapUIProps) {
    const isSearchModal = useAppSelector(selectSearchModal)
    const start = useAppSelector(selectFromPoint)
    const end = useAppSelector(selectToPoint)

    const [isStartPressed, setIsStartPressed] = useState(false)
        
    return (
        <div className={`container ${style.uiContainer}`}>
            <div className={style.mapElementsDiv}>
                <div className={style.headerDiv}>
                    <OpenSearchBtn isEnd={false} setIsStartPressed={setIsStartPressed} />
                    <OpenSearchBtn isEnd={true} setIsStartPressed={setIsStartPressed} />
                    <BackButton/>
                </div>
                { isSearchModal && <SearchModal isStartPressed={isStartPressed} /> }
            </div>
            <div className={style.floorListContainer}>
                <FloorsList currentInst={instFullName} firstFloor={firstFloor} lastFloor={lastFloor}/>
            </div>
            <div className={style.instituteNameDiv}>
                <RedirectInstitute instName={ start ? start.institute : (end ? end.institute : instFullName) } currentInst={instFullName}/>
                {end && start && end.institute === start.institute ? 
                    <RedirectInstitute instName={end.institute} currentInst={instFullName}/>:
                    null
                }
            </div>
        </div>
    )
}

export default MapUI;