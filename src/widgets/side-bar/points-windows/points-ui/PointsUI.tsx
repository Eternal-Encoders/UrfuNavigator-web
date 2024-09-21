import { usePointsUIListHook } from '../../../../shared/hooks/PointsUIHook';
import { PointTypes } from '../../../../utils/interfaces';
import PointResult from '../point-result/PointResult';
import styles from './PointsUI.module.scss';

interface PointsUIProps {
    nameTo: string | undefined,
    nameFrom: string | undefined,
    typeTo: PointTypes | undefined,
    typeFrom: PointTypes | undefined,
    setNameFrom: (_name: string) => void,
    setTypeFrom: (_type: PointTypes | undefined) => void,
    setNameTo: (_name: string) => void,
    setTypeTo: (_type: PointTypes | undefined) => void,
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

    function preventPassThrough(e: React.TouchEvent<HTMLUListElement>) {
        e.preventDefault();
        e.stopPropagation();
    }

    return (
        <>
            {data &&
                <ul 
                    className={styles['ResultsList']}
                    onTouchStart={preventPassThrough}
                    onTouchMove={preventPassThrough}
                >
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