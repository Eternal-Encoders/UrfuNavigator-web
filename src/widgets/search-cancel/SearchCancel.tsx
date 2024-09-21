
import { selectPrevContent, setContent } from '../../features/sideBar/sideBarSlice';
import { EThemeMiniButton, MiniButton } from '../../shared/ui/MiniButton/MiniButton';
import { XSign } from '../../shared/ui/XSign/XSign';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { PointTypes } from '../../utils/interfaces';
import cls from './SearchCancel.module.scss';

interface SearchCancelProps {
    nameFrom: string | undefined,
    setNameFrom: (_name: string) => void,
    setTypeFrom: (_type: PointTypes | undefined) => void,
    nameTo: string | undefined,
    setNameTo: (_name: string) => void,
    setTypeTo: (_type: PointTypes | undefined) => void,
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
        <button onClick={clickHandler}>
            <MiniButton theme={EThemeMiniButton.CLEAR} className={cls.SearchCancel}>
                <XSign/>
            </MiniButton>
        </button>
    );
}

export default SearchCancel;