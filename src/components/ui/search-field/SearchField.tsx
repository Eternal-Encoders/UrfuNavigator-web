import { selectLang } from '../../../features/lang/langSlice';
import { setContentNoHistory } from '../../../features/sideBar/sideBarSlice';
import { useAppDispatch, useAppSelector } from '../../../store/hook';
import { Languages, SideBarContent } from '../../../utils/interfaces';
import styles from './search-field.module.css'

interface SearchFieldProps {
    nameFrom: string | undefined,
    setNameFrom: (name: string) => void,
    nameTo: string | undefined,
    setNameTo: (name: string) => void,
    isEnd: boolean
}

function SearchField({
        nameFrom, 
        setNameFrom,
        nameTo,
        setNameTo,
        isEnd
    }: SearchFieldProps) {
    const dispatch = useAppDispatch();
    const currentLanguage = useAppSelector(selectLang);

    const name = isEnd ? nameTo : nameFrom;
    const setName = isEnd ? setNameTo : setNameFrom;

    function nameCahngehandler(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value);

        if (e.currentTarget.value === '') {
            dispatch(setContentNoHistory(SideBarContent.TypeList))
        } else {
            dispatch(setContentNoHistory(SideBarContent.PointsList))
        }
    }

    return (
        <>
            <input type="text"
                className={styles['points-search-input']}
                value={ name }
                placeholder={ currentLanguage === Languages.English ? "Search for audiences and places" : "Поиск аудиторий и мест" }
                onChange={ (e) => nameCahngehandler(e) }
                autoFocus
            />
        </>
    );
}

export default SearchField;