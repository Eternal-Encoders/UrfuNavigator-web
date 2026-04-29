import { useTranslation } from 'react-i18next';
import { setContentNoHistory } from '../../features/sideBar/sideBarSlice';
import { useAppDispatch } from '../../store/hook';
import { TextInput } from '../../shared/ui/TextInput/TextInput';
import { SideBarContent } from '../../utils/interfaces';
import styles from './SearchField.module.scss';

interface SearchFieldProps {
    nameFrom: string | undefined,
    setNameFrom: (_name: string) => void,
    nameTo: string | undefined,
    setNameTo: (_name: string) => void,
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

    function nameChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
        setName(e.currentTarget.value);

        if (e.currentTarget.value === '') {
            dispatch(setContentNoHistory(SideBarContent.TypeList))
        } else {
            dispatch(setContentNoHistory(SideBarContent.PointsList))
        }
    }

    return (
        <>
            <TextInput
                type="text"
                className={styles['PointsSearchInput']}
                value={ name ? name : '' }
                placeholder={ t('SearchForAudiencesAndPlaces') }
                onChange={ (e) => nameChangeHandler(e) }
                autoFocus
                aria-label={ t('SearchForAudiencesAndPlaces') }
            />
        </>
    );
}

export default SearchField;