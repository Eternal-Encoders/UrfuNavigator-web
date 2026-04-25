import { useGetPointByIdQuery } from "../../features/api/apiSlice";
import { PointClear } from "../../features/descMenu/descMenuSlice"
import { useAppDispatch } from "../../store/hook";
import { PointTranslation } from "../../utils/interfaces"
import { XSign } from "../../shared/ui/XSign/XSign";
import { MiniButton } from "../../shared/ui/MiniButton/MiniButton";
import { PHONE_BREAKPOINT } from "../../utils/const";
import { useDrawer } from "../../shared/hooks/DrawerHook";
import { DrawerOrient } from "../../utils/interfaces";
import DecorDragable from "../decor-dragable/DecorDragable";

import style from './DescriptionMenui.module.scss'

interface DescriptionMenuProps {
    pointId: string
}

function DescriptionMenu({ pointId }: DescriptionMenuProps) {
    const  dispatch = useAppDispatch()
    const { data } = useGetPointByIdQuery(pointId)

    const {
        position,
        touchStartHandle,
        touchMoveHandle,
        touchEndHandle,
        isNearMin
    } = useDrawer(
        450,
        [135, 0.46, 0.95],
        DrawerOrient.Vertical
    );

    function onClickHandler() {
        dispatch(PointClear())
    }

    if (pointId === undefined || data === undefined) {
        return (
            <>
            </>
        )
    }

    const other_names = data.names.length <= 1 ? undefined : data.names.slice(1)

    const content = (
        <>
            <div className={style['desc-header']}>
                <div className={style['header-name']}>
                    {data.names[0]}
                </div>
                {}
                <button onClick={onClickHandler}>
                    <MiniButton>
                        <XSign/>
                    </MiniButton>
                </button>
            </div>
            <div>
                {other_names &&
                    <div>
                        <h4>
                            Другие названия
                        </h4>
                        <ul>
                            {other_names.map((e, i) => (
                                <li key={i}>
                                    {e}
                                </li>
                            ))}
                        </ul>
                    </div>
                }
                <div>
                    <h4>
                        Институт
                    </h4>
                    {data.institute}
                </div>
                <div>
                    <h4>
                        Описание
                    </h4>
                    {data.description}
                </div>
                <div>
                    <h4>
                        Прочая информация
                    </h4>
                    {data.info}
                </div>
                <div>
                    <h4>
                        Тип
                    </h4>
                    <ul>
                        {data.types.map((e, i) => (
                            <li key={i}>
                                {PointTranslation[e]}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4>
                        Время работы
                    </h4>
                    <ul>
                        {data.time.map((e, i) => (
                            <li key={i}>
                                {e?.from} - {e?.to}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )

    if (window.innerWidth <= PHONE_BREAKPOINT) {
        return (
            <>
                <div
                    className={style['desc-body']}
                    onTouchStart={touchStartHandle}
                    onTouchMove={touchMoveHandle}
                    onTouchEnd={() => {
                        touchEndHandle();
                        if (isNearMin(80)) {
                            onClickHandler()
                        }
                    }}
                    style={{
                        height: position
                    }}
                >
                    <DecorDragable/>
                    {content}
                </div>
            </>
        )
    }

    return (
        <>
            <div className={style['desc-container']}>
                {content}
            </div>
        </>
    );
}

export default DescriptionMenu