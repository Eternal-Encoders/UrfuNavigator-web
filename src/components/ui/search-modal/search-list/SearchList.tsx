import { IGraphPoint, PointTypes } from "../../../../utils/interfaces";
import { useGetPointsByNameQuery, useGetPointsByTypeQuery } from "../../../../features/api/apiSlice";
import SearchResultBtn from "../search-result-btn/SearchResultBtn";
import style from "./search-list-style.module.css"

interface SearchListProps {
    name: string,
    type: PointTypes,
    isStartPressed: boolean
}

function SearchList({ name, type, isStartPressed }: SearchListProps) {
    let searchPoints: IGraphPoint[] | undefined = undefined

    if (type !== PointTypes.Other) {
        const { data } = useGetPointsByTypeQuery({ type });
        searchPoints = data
    } else {
        const { data } = useGetPointsByNameQuery({ name, length: 40 });
        searchPoints = data
    }

    return (
        <>
            {searchPoints &&
                <ul className={style['results-list']}>
                    {(() => {
                        const searchResults = [];
                        for (let i=0; i < searchPoints.length; i++) {
                            searchResults.push(
                                <SearchResultBtn data={ searchPoints[i] } key={ searchPoints[i].id } isStartPressed={isStartPressed} />
                            );
                        }
                        return searchResults;
                    })()}
                </ul>
            }
        </>
    )
}

export default SearchList;