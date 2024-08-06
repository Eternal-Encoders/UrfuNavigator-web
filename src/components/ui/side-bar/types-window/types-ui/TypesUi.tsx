import { PointTypes } from "../../../../../utils/interfaces";
import { QIUCK_TIPS_LIST } from "../../../../../utils/const";
import TypesButton from "../types-button/TypesButton";

import style from "./types-ui.module.css";

interface TypesUiProps {
    setNameFrom: (name: string) => void,
    setTypeFrom: (type: PointTypes) => void,
    setNameTo: (name: string) => void,
    setTypeTo: (type: PointTypes) => void,
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

    return (
        <>
            <p className={style['quick-tips-text']}>
                Быстрый поиск
            </p>
            <ul className={`${style['quick-tips-list']} list-reset flex`}>
                {
                    QIUCK_TIPS_LIST.map(e => (
                        <li key={ e.tipName } className={style['quick-tips-list-item']}>
                            <TypesButton {...e} setName={setName} setType={setType} />
                        </li>
                    ))
                }
            </ul>
        </>
    )
}

export default TypesUi;