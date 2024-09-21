
import { setContentNoHistory } from '../../../../features/sideBar/sideBarSlice';
import { useAppDispatch } from '../../../../store/hook';
import { PointTypes, SideBarContent } from '../../../../utils/interfaces';
import style from './TypesButton.module.scss';

interface TypesButtonProps {
    tipType: PointTypes,
    title: string,
    tipIcon: string,
    setName: (_name: string) => void,
    setType: (_type: PointTypes) => void,
}

function TypesButton({
    tipType,
    title,
    tipIcon,
    setName,
    setType
}: TypesButtonProps) {
    const dispatch = useAppDispatch()

    function clickHandle() {
        setName(title);
        setType(tipType);
        dispatch(setContentNoHistory(SideBarContent.PointsList))
    }

    return (
        <button className={style['tip-btn-btn-reset']} onClick={clickHandle}>
            <img className={style['tip-icon']} src={ tipIcon }  alt={ title }/>
            <p className={style['tip-name']}>{ title }</p>
        </button>
    );
}

export default TypesButton;
