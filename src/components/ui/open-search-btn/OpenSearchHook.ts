import { useTranslation } from "react-i18next";
import { selectSearchPoints } from "../../../features/pointsSearch/pointsSearchSlice";
import { setContent } from "../../../features/sideBar/sideBarSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { InstColors } from "../../../utils/const";
import { SideBarContent } from "../../../utils/interfaces";

export function useOpenSearchHook(
        isEnd: boolean,
        isHomePage: boolean | undefined,
        setIsEnd: (isEnd: boolean) => void
    ) {
    const dispatch = useAppDispatch()
    const points = useAppSelector(selectSearchPoints)
    const {t} = useTranslation();

    const currentPoint = isEnd ? points.to: points.from;
    const color = currentPoint ? InstColors.get(currentPoint.institute) : "#CCCCCC";

    let text = ''
    if (isHomePage) {
        text = t('SearchForAudiencesAndPlaces')
    } else if (isEnd) {
        text = t('To')
    } else {
        text = t('From')
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