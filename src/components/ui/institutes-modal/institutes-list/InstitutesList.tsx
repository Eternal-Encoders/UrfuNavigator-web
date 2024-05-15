import React from "react";
import "./institutes-list-style.css"
import LinkToInstitute from "../link-to-institute/LinkToInstitute";

import { IInstituteIcon } from "../../../../utils/interfaces";
// import { findInstituteIcon } from "../../../../utils/server-connect";

interface InstitutesModalProps {
    instLink: IInstituteIcon[]
}

function InstitutesModal({instLink}: InstitutesModalProps) {
    const originUrl = import.meta.env.VITE_ORIGIN ? import.meta.env.VITE_ORIGIN as string: 'http://localhost:5000';
    // const [instLink, setInstLink] = React.useState<IInstituteIcon[]>([]);

    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);
    const [displayHeightModalInstitutes, setdisplayHeightModalInstitutes] = React.useState(0);

    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        setTouchStart(e.targetTouches[0].clientY);
    }
    
    function handleTouchMoveModalInstitutes(e: React.TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.targetTouches[0].clientY);

        if (120 < document.documentElement.scrollHeight - e.targetTouches[0].pageY &&
            document.documentElement.scrollHeight - e.targetTouches[0].pageY < 250) {
            setdisplayHeightModalInstitutes(document.documentElement.scrollHeight - e.targetTouches[0].clientY - 250)
        }
    }
    
    function handleTouchEndModalInstitutes() {
        if (touchStart - touchEnd > 30) {
            setdisplayHeightModalInstitutes(0)
        }
    
        if (touchStart - touchEnd < -30) {
            setdisplayHeightModalInstitutes(-125)
        }
    }

    // React.useEffect(() => {
    //     async function getInstLink() {
    //         const tes = await findInstituteIcon();
    //         setInstLink(tes);
    //     }

    //     void getInstLink();
    // }, [setInstLink]);

    return (
        <div className="institutes-modal" 
            onTouchStart={(e) => handleTouchStart(e)}
            onTouchMove={(e) => handleTouchMoveModalInstitutes(e)}
            onTouchEnd={() => handleTouchEndModalInstitutes()}
            style={{ bottom: displayHeightModalInstitutes + 'px' }}
        >
            <div className="pull-btn"/> 
            <ul className="institutions-list list-reset"
            > 
                
                {
                    instLink.map(e => (
                        <li key={ e.name } className="institutions-list-item">
                            <LinkToInstitute 
                                instPath={ `/institute/${e.url[0] === "/" ? e.url.slice(1): e.url}` } 
                                instName={ e.displayableName } 
                                instIcon={ `${originUrl}${e.icon.url}` }
                            />
                        </li>
                        ))
                }
            </ul>
        </div>
    )
}

export default InstitutesModal;