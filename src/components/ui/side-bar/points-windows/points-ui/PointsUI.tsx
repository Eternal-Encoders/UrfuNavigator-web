import { PointTypes } from "../../../../../utils/interfaces";
import PointResult from "../point-result/PointResult";
import { usePointsUIListHook } from "./PointsUIHook";
import styles from './points-ui.module.css'

interface PointsUIProps {
    nameTo: string | undefined,
    nameFrom: string | undefined,
    typeTo: PointTypes | undefined,
    typeFrom: PointTypes | undefined,
    setNameFrom: (name: string) => void,
    setTypeFrom: (type: PointTypes | undefined) => void,
    setNameTo: (name: string) => void,
    setTypeTo: (type: PointTypes | undefined) => void,
    isEnd: boolean
}

function PointsUI({
    nameFrom, 
    nameTo, 
    typeTo, 
    typeFrom,
    setNameFrom,
    setTypeFrom,
    setNameTo,
    setTypeTo,
    isEnd
}: PointsUIProps) {
    const name = isEnd ? nameTo : nameFrom;
    const type = isEnd ? typeTo : typeFrom;
    const setName = isEnd ? setNameTo : setNameFrom;
    const setType = isEnd ? setTypeTo : setTypeFrom;

    const data = usePointsUIListHook(name, type);

    return (
        <>
            {data &&
                <ul className={styles['results-list']}>
                    {(() => {
                        const searchResults = [];
                        for (let i=0; i < data.length; i++) {
                            searchResults.push(
                                <PointResult 
                                    data={ data[i] } key={ data[i].id } isEnd={isEnd}
                                    setName={setName}
                                    setType={setType}
                                />
                            );
                        }
                        return searchResults;
                    })()}
                </ul>
            }
        </>
    );
}

export default PointsUI;