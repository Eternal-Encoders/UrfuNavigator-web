import { useContext } from "react";
import { Link } from "react-router-dom";
import { RouteContext } from "../../../../contextes/RouteContext";
import { MapContext } from "../../../../contextes/MapContext";
import NameInstitute from "../name-institute/nameInstitute";
import { InstLinks, InstColors } from "../../../../utils/const";

import "./redirect-institute-style.css";

interface RedirectInstituteProps {
    currentInst: string,
    instName: string
}

function RedirectInstitute({ instName, currentInst }: RedirectInstituteProps) {
    const { floors } = useContext(RouteContext);
    const { setCurrentFloor } = useContext(MapContext)
    const link = InstLinks.get(instName);

    const activeStyles = {
        color: "#FFFFFF", 
        background: InstColors.get(currentInst)
    }

    const nonActiveStyles = {
        color: "#6D6D6D", 
        background: "#EEEEEE"
    }

    function onRedirectInstituteClick() {
        if (instName in floors)
            setCurrentFloor(Number(floors[instName][0]));
    }
    
    return (
        <div className="redirect-container" style={currentInst !== instName ? nonActiveStyles : activeStyles}>
            { currentInst !== instName ?
                <Link onClick={ onRedirectInstituteClick } to={ link ? `/institute${link}` : "/" } className="redirect-institute">
                    <NameInstitute name={ instName } isActive={ true }/>
                </Link>
                :
                <NameInstitute name={ instName } isActive={ false }/>
            }
        </div>
    )
}

export default RedirectInstitute;