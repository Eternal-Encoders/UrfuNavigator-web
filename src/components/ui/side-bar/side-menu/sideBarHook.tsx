import { useEffect, useState } from "react";
import { selectContent, selectPrevContent, setContent } from "../../../../features/sideBar/sideBarSlice";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { PointTypes, SideBarContent } from "../../../../utils/interfaces";

import { useTranslation } from "react-i18next";
import BackButton from "../../back-button/BackButton";
import HeaderTitle from "../../header-title/HeaderTitle";
import OpenSearchBtn from "../../open-search-btn/OpenSearchBtn";
import OpneSettingsBtn from "../../open-settings-btn/OpenSettingsBtn";
import SearchCancel from "../../search-cancel/SearchCancel";
import SearchField from "../../search-field/SearchField";
import InstitutesUI from "../institutes-window/institutes-list/InstitutesUI";
import PointsUI from "../points-windows/points-ui/PointsUI";
import SettingsCancelBtn from "../settings-window/settings-cancel-btn/SettingsCancelBtn";
import SettingsUI from "../settings-window/settings-ui/SettingsUi";
import TypesUi from "../types-window/types-ui/TypesUi";
import searchImg from "./img/seacrh-img.svg";

export function useSideBarHook(
    setPosToMin: () => void,
    setPosToMiddle: () => void,
    setPosToMax: () => void,
    isNearMin: (threshold?: number) => boolean,
    isNearMiddle: (threshold?: number) => boolean,
    isNearMax: (threshold?: number) => boolean,
) {
    const sideBarContent = useAppSelector(selectContent);
    const prevContent = useAppSelector(selectPrevContent);
    const dispatch = useAppDispatch();

    const [nameFrom, setNameFrom] = useState<string | undefined>(undefined);
    const [nameTo, setNameTo] = useState<string | undefined>(undefined);
    const [typeFrom, setTypeFrom] = useState<PointTypes | undefined>(undefined);
    const [typeTo, setTypeTo] = useState<PointTypes | undefined>(undefined);
    const [isEnd, setIsEnd] = useState<boolean>(false);
    const {t} = useTranslation();

    const MOVE_BACK_THRESHOLD = 15;
    const MOVE_MAX_THRESHOLD = 110;
    const MOVE_MIDDLE_THRESHOLD = 40;

    function _getBody() {
        switch(sideBarContent) {
            case SideBarContent.Institutes:
                return (<InstitutesUI />);
            case SideBarContent.PointsList:
                return (<PointsUI 
                    nameFrom={nameFrom} 
                    nameTo={nameTo}
                    typeFrom={typeFrom}
                    typeTo={typeTo}
                    setNameFrom={setNameFrom}
                    setNameTo={setNameTo}
                    setTypeTo={setTypeTo}
                    setTypeFrom={setTypeFrom}
                    isEnd={isEnd} 
                />);
            case SideBarContent.Settings:
                return (<SettingsUI />);
            case SideBarContent.TypeList:
                return (<TypesUi
                    setNameFrom={setNameFrom}
                    setNameTo={setNameTo}
                    setTypeTo={setTypeTo}
                    setTypeFrom={setTypeFrom}
                    isEnd={isEnd}
                />);
            case SideBarContent.Empty:
                return (<></>);
        }
    }
    
    function _getHeader() {
        switch(sideBarContent) {
            case SideBarContent.Institutes:
                return (
                    <>
                        <OpneSettingsBtn />
                        <OpenSearchBtn isEnd isHomePage setIsEnd={setIsEnd} />
                    </>
                );
            case SideBarContent.TypeList:
            case SideBarContent.PointsList:
                return (
                    <>
                        <img src={ searchImg } alt='Поиск'/>
                        <SearchField 
                            nameFrom={nameFrom}
                            nameTo={nameTo}
                            setNameFrom={setNameFrom}
                            setNameTo={setNameTo}
                            isEnd={isEnd} 
                        />
                        <SearchCancel 
                            nameFrom={nameFrom}
                            nameTo={nameTo}
                            setNameFrom={setNameFrom}
                            setNameTo={setNameTo}
                            setTypeFrom={setTypeFrom}
                            setTypeTo={setTypeTo}
                            isEnd={isEnd} 
                        />
                    </>
                );
            case SideBarContent.Settings:
                return (
                    <>
                        <HeaderTitle text={t('Settings')} />
                        <SettingsCancelBtn />
                    </>
                );
            case SideBarContent.Empty:
                return (
                    <>
                        <OpenSearchBtn isEnd={false} setIsEnd={setIsEnd} />
                        <OpenSearchBtn isEnd setIsEnd={setIsEnd} />
                        <BackButton />
                    </>
                );
        }
    }

    useEffect(() => {
        switch (sideBarContent) {
            case SideBarContent.TypeList:
            case SideBarContent.PointsList:
            case SideBarContent.Settings:
                setPosToMax();
                break;
            case SideBarContent.Institutes:
                setPosToMin();
                break;
        }
    }, [sideBarContent]);

    function sideTouchEndHandle() {
        if (sideBarContent === SideBarContent.Institutes) {
            if (isNearMiddle(MOVE_MIDDLE_THRESHOLD)) {
                setPosToMiddle();
            }
        } else {
            if (isNearMax(MOVE_MAX_THRESHOLD)) {
                setPosToMax();
            } else if (isNearMin(MOVE_BACK_THRESHOLD)) {
                dispatch(setContent(prevContent));
            }
        }
    }

    const sideBarHeader = _getHeader();
    const sideBarBody = _getBody();
    const isEmpty = sideBarContent === SideBarContent.Empty;
    const isHeadInDrawer = [
        SideBarContent.TypeList,
        SideBarContent.PointsList,
        SideBarContent.Settings
    ].indexOf(sideBarContent) !== -1;
    
    return {
        sideBarBody,
        sideBarHeader,
        isEmpty,
        isHeadInDrawer,
        sideTouchEndHandle
    }
}