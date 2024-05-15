import { useState, useEffect } from "react";
import SearchResults from "../search-result-btn/SearchResultBtn";
import { findSearchResults, findDataByType } from "../../../../utils/server-connect";
import { IGraphPoint, PointTypes } from "../../../../utils/interfaces";

import "./search-list-style.css"

interface SearchListProps {
    name: string,
    type: PointTypes
}

function SearchList({ name, type }: SearchListProps) {
    const [searchPoints, setSearchPoints] = useState<IGraphPoint[]>([]);

    useEffect(() => {
        async function getSearchPoints() {
            if (type !== PointTypes.Other) {
                setSearchPoints(await findDataByType(type));
            } else {
                setSearchPoints(await findSearchResults(name, 40));
            }
        }
        void getSearchPoints();
    }, [name, type]);

    return (
        <>
            <ul className="results-list">
                {(() => {
                    const searchResults = [];
                    for (let i=0; i < searchPoints.length; i++) {
                        searchResults.push(<SearchResults data={ searchPoints[i] } key={ searchPoints[i].id }/>);
                    }
                    return searchResults;
                })()}
            </ul>
        </>
    )
}

export default SearchList;