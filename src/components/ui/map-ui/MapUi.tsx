import { useContext } from "react";
import { GlobalContext } from "../../../contextes/GlobalContext";
import { RouteContext } from "../../../contextes/RouteContext";
import BackButton from "../back-button/BackButton";
import FloorsList from "../switching-floors/floors-list/FloorsList";
import OpenSearchBtn from "../open-search-btn/OpenSearchBtn";
import SearchModal from "../search-modal/search-ui/SearchUi";
import RedirectInstitute from "../switching-institutions/redirect-institute/redirect-institute";
import Stack from "../stack/Stack";
import { PointSearchTyping } from "../../../utils/const";

import "./map-ui-style.css";

interface MapUIProps {
    instFullName: string,
    firstFloor: number,
    lastFloor: number
}

function MapUI({ instFullName, firstFloor, lastFloor }: MapUIProps) {
    const { isSearchModal } = useContext(GlobalContext);
    const { points } = useContext(RouteContext)
    const start = points[PointSearchTyping.start];
    const end = points[PointSearchTyping.end];
        
    return (
        <div className="container ui-container">
            <div className="map-elements-div">
                <div className="header-div">
                    <OpenSearchBtn value={PointSearchTyping.start} isHomePage={false}/>
                    <OpenSearchBtn value={PointSearchTyping.end} isHomePage={false}/>
                    <BackButton/>
                </div>
                { isSearchModal && <SearchModal/> }
            </div>
            <div className="floor-list-container">
                <FloorsList currentInst={instFullName} firstFloor={firstFloor} lastFloor={lastFloor}/>
            </div>
            <div className="institute-name-div">
                <RedirectInstitute instName={ start ? start.institute : (end ? end.institute : instFullName) } currentInst={instFullName}/>
                {end && start && end.institute === start.institute ? null : end && start &&
                    <RedirectInstitute instName={end.institute} currentInst={instFullName}/>
                }
            </div>
            <Stack />
        </div>
    )
}

export default MapUI;