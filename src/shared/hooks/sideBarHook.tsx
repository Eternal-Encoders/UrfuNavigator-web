import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import {
    selectContent,
    selectPrevContent,
    setContent
} from '../../features/sideBar/sideBarSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';
import { PointTypes, SideBarContent } from '../../utils/interfaces';
import { BackButton } from '../../widgets/BackButton';
import { CloseButton } from '../../widgets/CloseButton';
import HeaderTitle from '../../widgets/header-title/HeaderTitle';
import OpenSearchBtn from '../../widgets/open-search-btn/OpenSearchBtn';
import OpneSettingsBtn from '../../widgets/open-settings-btn/OpenSettingsBtn';
import SearchCancel from '../../widgets/search-cancel/SearchCancel';
import SearchField from '../../widgets/search-field/SearchField';
import InstitutesUI from '../../widgets/side-bar/institutes-window/institutes-list/InstitutesUI';
import PointsUI from '../../widgets/side-bar/points-windows/points-ui/PointsUI';
import SettingsUI from '../../widgets/side-bar/settings-window/settings-ui/SettingsUi';
import TypesUi from '../../widgets/side-bar/types-window/types-ui/TypesUi';
import searchImg from '../assets/icons/search.svg';

export function useSideBarHook(
    setPosToMin: () => void,
    setPosToMiddle: () => void,
    setPosToMax: () => void,
    isNearMin: (_threshold?: number) => boolean,
    isNearMiddle: (_threshold?: number) => boolean,
    isNearMax: (_threshold?: number) => boolean,
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
                    <img style={{width: 40, height: 40}} src={ searchImg } alt='Поиск'/>
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
                    <CloseButton/>
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