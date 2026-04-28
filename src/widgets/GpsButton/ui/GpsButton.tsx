import { selectGps, setGps } from "../../../features/rootData/rootDataSlice";
import { EThemeMiniButton, MiniButton } from "../../../shared/ui/MiniButton/MiniButton";
import { XSign } from "../../../shared/ui/XSign/XSign";
import { useAppDispatch, useAppSelector } from "../../../store/hook";

export const GpsButton = () => {
    const dispatch = useAppDispatch()
    const gpsEnabled = useAppSelector(selectGps)

    function onClickHandler() {
        dispatch(setGps(!gpsEnabled))
    }

    return (
        <button onClick={ onClickHandler } >
            <MiniButton 
                theme={EThemeMiniButton.PAINTED} 
            >
                <XSign/>
                GPS
            </MiniButton>
        </button>
    );
};