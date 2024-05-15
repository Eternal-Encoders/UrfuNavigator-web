import React, { useState, useContext, useRef, useEffect } from "react";
import { GlobalContext } from "../../../../contextes/GlobalContext";
import SearchList from "../search-list/SearchList";
import QuickTipsList from "../quick-tips/quick-tips-list/QuickTipsList";
import SearchCancelBtn from "../search-cancel-btn/SearchCancelBtn";
import { PointSearchTyping } from "../../../../utils/const";
import { PointTypes } from "../../../../utils/interfaces";

import searchImg from "./img/seacrh-img.svg"
import "./search-ui-style.css";


function SearchModal() {
    const { setIsSearchModal, currentLanguage } = useContext(GlobalContext);

    const paddingRelativeScreenWidth = window.screen.width > 1200 ? 0 : 5;
    const [displayHeight, setdisplayHeight] = React.useState(paddingRelativeScreenWidth); 
    const [touchStart, setTouchStart] = React.useState(0);
    const [touchEnd, setTouchEnd] = React.useState(0);

    const [name, setName] = useState('');
    const [type, setType] = useState(PointTypes.Other);

    const inputRef = useRef<HTMLInputElement>(null);
    
    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        setTouchStart(e.targetTouches[0].clientY);
    }

    function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.targetTouches[0].clientY);
        if (touchStart - touchEnd > 0) {
            setdisplayHeight(5)
        } else {
            setdisplayHeight((e.targetTouches[0].clientY * 100) /  window.screen.height)
        }
    }

    function handleTouchEnd() {
        setdisplayHeight(paddingRelativeScreenWidth)
        if (touchStart - touchEnd < -30) {
            setIsSearchModal(false);
        } 
    }

    function onCancelBtnClick() {
        setName("")
        setType(PointTypes.Other)
    }

    function onTipClick(name: string, type: PointTypes) {
        setName(name);
        setType(type);
    }

    function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.currentTarget.value.indexOf("-") <= 0 && e.currentTarget.value.indexOf(" ") <= 0) {
            setName(e.currentTarget.value.replace(/[^0-9](?=[0-9])/g, '$& '))
        }
        else {
            setName(e.currentTarget.value)
        }
        setType(PointTypes.Other)
    }

    useEffect(() => {
        if (!['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
            inputRef.current?.focus();
        }
      }, []);

    return (
        <div className="container search-container modal-window"
            onTouchStart={ (e) => handleTouchStart(e) }
            onTouchMove={ (e) => handleTouchMove(e) }
            onTouchEnd={ () => handleTouchEnd() }
            style={{ top: displayHeight + '%', height: window.screen.height }}
        >
            <div className="pull-btn"/>
            <div className="modal-search-input-div">
                <img src={ searchImg } alt='Поиск'/>
                <input type="text"
                    ref={ inputRef }
                    className="points-search-input"
                    value={ name }
                    placeholder={ currentLanguage === "english" ? "Search for audiences and places" : PointSearchTyping.homePageText }
                    onChange={ (e) => onNameChange(e) }
                    // autoFocus={ true }
                />
                <SearchCancelBtn name={ name } onClick={ onCancelBtnClick }/>
            </div>
            {name === "" ? <QuickTipsList onClick={ onTipClick }/> : <SearchList name={ name } type={ type }/>}
        </div>
    )
}

export default SearchModal;