import { selectLang } from "../../../features/lang/langSlice";
import { selectSearchPoints } from "../../../features/pointsSearch/pointsSearchSlice";
import { setContent } from "../../../features/sideBar/sideBarSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { InstColors } from "../../../utils/const";
import { Languages, SideBarContent } from "../../../utils/interfaces";

export function useOpenSearchHook(
        isEnd: boolean,
        isHomePage: boolean | undefined,
        setIsEnd: (isEnd: boolean) => void
    ) {
    const dispatch = useAppDispatch()
    const currentLanguage = useAppSelector(selectLang)
    const points = useAppSelector(selectSearchPoints)

    const currentPoint = isEnd ? points.to: points.from;
    const color = currentPoint ? InstColors.get(currentPoint.institute) : "#CCCCCC";

    let text = ''
    if (isHomePage) {
        text = currentLanguage === Languages.English ? "Search for audiences and places": "Поиск аудиторий и мест"
    } else if (isEnd) {
        text = currentLanguage === Languages.English ? "To": "Куда"
    } else {
        text = currentLanguage === Languages.English ? "From": "Откуда"
    }

    function onClickHandler() {
        setIsEnd(isEnd);
        dispatch(setContent(SideBarContent.TypeList));
    }

    return {
        color,
        text,
        currentPoint,
        onClickHandler
    };
}