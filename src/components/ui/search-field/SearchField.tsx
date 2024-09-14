import { useTranslation } from 'react-i18next';
import { setContentNoHistory } from '../../../features/sideBar/sideBarSlice';
import { useAppDispatch } from '../../../store/hook';
import { SideBarContent } from '../../../utils/interfaces';
import styles from './search-field.module.css';

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
    const {t} = useTranslation();

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
                placeholder={ t('SearchForAudiencesAndPlaces') }
                onChange={ (e) => nameCahngehandler(e) }
                autoFocus
            />
        </>
    );
}

export default SearchField;