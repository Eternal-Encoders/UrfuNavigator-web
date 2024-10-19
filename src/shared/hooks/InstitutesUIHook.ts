import { useState } from 'react';
import { useGetInstitutesQuery } from '../../features/api/apiSlice';


export function useInstituteUI() {
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [displayHeightModalInstitutes, setdisplayHeightModalInstitutes] = useState(0);

    const { data } = useGetInstitutesQuery(undefined)
    const instLink = data ? data: []

    function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        setTouchStart(e.targetTouches[0].clientY);
    }
    
    function handleTouchMoveModalInstitutes(e: React.TouchEvent<HTMLDivElement>) {
        setTouchEnd(e.targetTouches[0].clientY);

        if (120 < document.documentElement.scrollHeight - e.targetTouches[0].pageY &&
            document.documentElement.scrollHeight - e.targetTouches[0].pageY < 250) {
            setdisplayHeightModalInstitutes(document.documentElement.scrollHeight - e.targetTouches[0].clientY - 250)
        }
    }
    
    function handleTouchEndModalInstitutes() {
        if (touchStart - touchEnd > 30) {
            setdisplayHeightModalInstitutes(0)
        }
    
        if (touchStart - touchEnd < -30) {
            setdisplayHeightModalInstitutes(-125)
        }
    }

    return {
        instLink,
        displayHeightModalInstitutes,
        handleTouchStart,
        handleTouchMoveModalInstitutes,
        handleTouchEndModalInstitutes
    }
}