import { useState } from "react";
import { selectContent } from "../../../../features/sideBar/sideBarSlice";
import { useAppSelector } from "../../../../store/hook";
import { Languages, PointTypes, SideBarContent } from "../../../../utils/interfaces";

import BackButton from "../../back-button/BackButton";
import OpenSearchBtn from "../../open-search-btn/OpenSearchBtn";
import OpneSettingsBtn from "../../open-settings-btn/OpenSettingsBtn";
import InstitutesUI from "../institutes-window/institutes-list/InstitutesUI";
import SettingsUI from "../settings-window/settings-ui/SettingsUi";
import TypesUi from "../types-window/types-ui/TypesUi";
import searchImg from "./img/seacrh-img.svg"
import SearchField from "../../search-field/SearchField";
import SearchCancel from "../../search-cancel/SearchCancel";
import PointsUI from "../points-windows/points-ui/PointsUI";
import HeaderTitle from "../../header-title/HeaderTitle";
import SettingsCancelBtn from "../settings-window/settings-cancel-btn/SettingsCancelBtn";

export function useSideBarHook() {
    const sideBarContent = useAppSelector(selectContent)

    const [nameFrom, setNameFrom] = useState<string | undefined>(undefined);
    const [nameTo, setNameTo] = useState<string | undefined>(undefined);
    const [typeFrom, setTypeFrom] = useState<PointTypes | undefined>(undefined)
    const [typeTo, setTypeTo] = useState<PointTypes | undefined>(undefined)

    const [isEnd, setIsEnd] = useState<boolean>(false);

    function getBody() {
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
    
    function getHeader() {
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
                        <HeaderTitle text={{
                            [Languages.Russian]: 'Настройки',
                            [Languages.English]: 'Settings'
                        }} />
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

    const sideBarHeader = getHeader()
    const sideBarBody = getBody()

    return {
        sideBarBody,
        sideBarHeader
    }
}