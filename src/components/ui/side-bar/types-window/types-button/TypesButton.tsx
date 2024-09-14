import { useTranslation } from "react-i18next";
import { setContentNoHistory } from "../../../../../features/sideBar/sideBarSlice";
import { useAppDispatch } from "../../../../../store/hook";
import { PointTypes, SideBarContent } from "../../../../../utils/interfaces";
import style from "./types-btn-style.module.css";

interface TypesButtonProps {
    tipType: PointTypes,
    tipName: string,
    tipNameEng: string,
    tipIcon: string,
    setName: (name: string) => void,
    setType: (type: PointTypes) => void,
}

function TypesButton({
    tipType,
    tipName,
    tipNameEng,
    tipIcon,
    setName,
    setType
}: TypesButtonProps) {
    const dispatch = useAppDispatch()
    const {i18n} = useTranslation();

    const name = i18n.language === 'en' ? tipNameEng : tipName

    function clickHandle() {
        setName(name);
        setType(tipType);
        dispatch(setContentNoHistory(SideBarContent.PointsList))
    }

    return (
        <button className={style['tip-btn-btn-reset']} onClick={clickHandle}>
            <img className={style['tip-icon']} src={ tipIcon }  alt={ name }/>
            <p className={style['tip-name']}>{ name }</p>
        </button>
    );
}

export default TypesButton;
