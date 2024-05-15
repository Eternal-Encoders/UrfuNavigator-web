import { Link } from "react-router-dom";

import "./link-to-institute-style.css";

interface LinkToInstituteProps {
    instPath: string,
    instName: string,
    instIcon: string
}

function LinkToInstitute({ instPath, instIcon, instName }: LinkToInstituteProps) {
    return (
        <Link to={ instPath } className="institutions-list-item-link flex">
            <button className="btn-reset">
                <img className="institutions-icon" src={ instIcon } alt={ instName }/>
                <p className="institutions-name">{ instName }</p>
            </button>
        </Link>
    );
}

export default LinkToInstitute