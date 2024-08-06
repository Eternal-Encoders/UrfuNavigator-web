import { selectPrevContent, setContent } from "../../../features/sideBar/sideBarSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { PointTypes } from "../../../utils/interfaces";
import cancelBtn from "./img/cancel-btn.svg";
import styles from './search-cancel.module.css'

interface SearchCancelProps {
    nameFrom: string | undefined,
    setNameFrom: (name: string) => void,
    setTypeFrom: (type: PointTypes | undefined) => void,
    nameTo: string | undefined,
    setNameTo: (name: string) => void,
    setTypeTo: (type: PointTypes | undefined) => void,
    isEnd: boolean
}

function SearchCancel({
        nameFrom, 
        setNameFrom,
        setTypeFrom,
        nameTo,
        setNameTo,
        setTypeTo,
        isEnd
    }: SearchCancelProps) {
    const dispatch = useAppDispatch();
    const prevContent = useAppSelector(selectPrevContent);

    const name = isEnd ? nameTo : nameFrom;
    const setName = isEnd ? setNameTo : setNameFrom;
    const setType = isEnd ? setTypeTo : setTypeFrom;

    function clickHandler() {
        if (name && name != '') {
            setName('');
            setType(undefined);
        } else {
            dispatch(setContent(prevContent))
        }
    }

    return (
        <>
            <button className={styles['back-btn']} onClick={ clickHandler }>
                <img src={ cancelBtn } alt='Назад'/>
            </button>
        </>
    );
}

export default SearchCancel;