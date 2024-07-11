import { RefObject, useEffect, useState } from "react";
import { PointTypes } from "../../../../utils/interfaces";
import { toggleLang } from "../../../../features/lang/langSlice";
import { useAppDispatch } from "../../../../store/hook";

export function useSearchUi(inputRef: RefObject<HTMLInputElement>) {
    const dispatch = useAppDispatch()

    const paddingRelativeScreenWidth = window.screen.width > 1200 ? 0 : 5;
    const [displayHeight, setdisplayHeight] = useState(paddingRelativeScreenWidth); 
    const [touchStart, setTouchStart] =useState(0);
    const [touchEnd, setTouchEnd] =useState(0);

    const [name, setName] = useState('');
    const [type, setType] = useState(PointTypes.Other);
    
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
            dispatch(toggleLang());
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

    return {
        displayHeight,
        type,
        name,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        onNameChange,
        onCancelBtnClick,
        onTipClick
    }
}