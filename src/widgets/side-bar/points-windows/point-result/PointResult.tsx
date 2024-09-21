
import { useNavigate } from 'react-router-dom';
import { floorSet } from '../../../../features/floor/floorSlice';
import { setFromPoint, setToPoint } from '../../../../features/pointsSearch/pointsSearchSlice';
import { selectPrevContent, setContent } from '../../../../features/sideBar/sideBarSlice';
import { useAppDispatch, useAppSelector } from '../../../../store/hook';
import { InstColors, InstLinks } from '../../../../utils/const';
import { IGraphPoint, PointTypes } from '../../../../utils/interfaces';
import styles from './PointResult.module.scss';

interface PointResultProps {
    data: IGraphPoint,
    setName: (_name: string) => void,
    setType: (_type: PointTypes | undefined) => void,
    isEnd: boolean
}

function PointResult({data, setName, setType, isEnd}: PointResultProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const prevContent = useAppSelector(selectPrevContent);

    function clickHandler() {
        if (isEnd) {
            dispatch(setToPoint(data));
        } else {
            dispatch(setFromPoint(data));
        }
        dispatch(setContent(prevContent));

        setName('');
        setType(undefined);

        const link = InstLinks.get(data.institute);
        if (link && window.location.pathname === '/') {
            navigate(`/institute${link}`);
            dispatch(floorSet(data.floor));
        }
    }

    return (
        <>
            <li>
                <button className={styles['SearchResultBtn']} onClick={ clickHandler }>
                    <p className={styles['search-result-btn-name']}>{ data.names.join(', ') }</p>
                    <div className={styles['search-result-addition']}>
                        <div 
                            className={styles['search-result-addition-img']} 
                            style={{ backgroundColor: InstColors.get(data.institute) }}/>
                        <p className={styles['search-result-addition-name']}>{ data.institute }</p>
                    </div>
                </button>
            </li>
        </>
    );
}

export default PointResult;