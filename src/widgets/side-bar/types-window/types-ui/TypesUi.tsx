import { useTranslation } from 'react-i18next';
import TypesButton from '../types-button/TypesButton';

import { QIUCK_TIPS_LIST } from '../../../../utils/const';
import { PointTypes } from '../../../../utils/interfaces';
import style from './TypesUi.module.scss';

interface TypesUiProps {
    setNameFrom: (_name: string) => void,
    setTypeFrom: (_type: PointTypes) => void,
    setNameTo: (_name: string) => void,
    setTypeTo: (_type: PointTypes) => void,
    isEnd: boolean
}

function TypesUi({
    setNameFrom,
    setNameTo,
    setTypeFrom,
    setTypeTo,
    isEnd
}: TypesUiProps) {

    const setType = isEnd ? setTypeTo : setTypeFrom;
    const setName = isEnd ? setNameTo : setNameFrom;

    const {t} = useTranslation();

    return (
        <>
            <p className={style['quick-tips-text']}>
                {t('QuickSearch')}
            </p>
            <ul className={`${style['quick-tips-list']} list-reset flex`}>
                {
                    QIUCK_TIPS_LIST.map(({title, tipType, tipIcon}) => (
                        <li key={ tipType } className={style['quick-tips-list-item']}>
                            <TypesButton 
                                tipType={tipType} 
                                tipIcon={tipIcon} 
                                title={t(title)} 
                                setName={setName} 
                                setType={setType} 
                            />
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default TypesUi;