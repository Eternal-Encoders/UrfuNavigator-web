import { Link } from "react-router-dom";

import { InstLinks, InstColors } from "../../../../utils/const";
import { redirectContainer } from './redirect-institute-style.module.css'

import NameInstitute from "../name-institute/nameInstitute";

interface RedirectInstituteProps {
    currentInst: string,
    instName: string
}

function RedirectInstitute({ instName, currentInst }: RedirectInstituteProps) {
    const link = InstLinks.get(instName);

    const activeStyles = {
        color: "#FFFFFF", 
        background: InstColors.get(currentInst)
    }

    const nonActiveStyles = {
        color: "#6D6D6D", 
        background: "#EEEEEE"
    }
    
    return (
        <div className={redirectContainer} style={currentInst !== instName ? nonActiveStyles : activeStyles}>
            { currentInst !== instName ?
                <Link to={ link ? `/institute${link}` : "/" } className="redirect-institute">
                    <NameInstitute name={ instName } isActive={ true }/>
                </Link>
                :
                <NameInstitute name={ instName } isActive={ false }/>
            }
        </div>
    )
}

export default RedirectInstitute;