import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../../../contextes/GlobalContext";
import { RouteContext } from "../../../../contextes/RouteContext";
import { MapContext } from "../../../../contextes/MapContext";
import { IGraphPoint } from "../../../../utils/interfaces";
import { PointSearchTyping, InstColors } from "../../../../utils/const";
import { InstLinks } from "../../../../utils/const";

import "./search-result-btn-style.css";

interface SearchResultBtnProps {
    data: IGraphPoint,
}

function SearchResultBtn({ data }: SearchResultBtnProps) {
    const { points, setPoints, isStartPoint } = useContext(RouteContext);
    const { setIsSearchModal } = useContext(GlobalContext);
    const { setCurrentFloor } = useContext(MapContext);
    const navigate = useNavigate();

    function onClickHandler() {
        const link = InstLinks.get(data.institute)

        if (isStartPoint) {
            setPoints({ ...points, [PointSearchTyping.start]: data });
        } else {
            setPoints({ ...points, [PointSearchTyping.end]: data });
        }

        setIsSearchModal(false);

        if (link && (window.location.pathname === "/" || isStartPoint || !points[PointSearchTyping.start])) {
            navigate(`/institute${link}`);
            setCurrentFloor(data.floor);
        }
    }

    return (
        <li>
            <button className="search-result-btn" onClick={ onClickHandler }>
                <p className="search-result-btn-name">{ data.names.join(', ') }</p>
                <div className="search-result-addition">
                    <div className="search-result-addition-img" style={{ backgroundColor: InstColors.get(data.institute) }}/>
                    <p className="search-result-addition-name">{ data.institute }</p>
                </div>
            </button>
        </li>
    )
}

export default SearchResultBtn;