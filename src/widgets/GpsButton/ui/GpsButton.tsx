import { selectGps, setGps } from "../../../features/rootData/rootDataSlice";
import { classNames } from "../../../shared/lib/classNames/classNames";
import gpsIcon from "../../../shared/assets/icons/gps.svg";
import { IconButton } from "../../../shared/ui/IconButton/IconButton";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import cls from "./GpsButton.module.scss";

export const GpsButton = () => {
    const dispatch = useAppDispatch()
    const gpsEnabled = useAppSelector(selectGps)

    function onClickHandler() {
        dispatch(setGps(!gpsEnabled))
    }

    return (
        <IconButton
            onClick={ onClickHandler }
            label="GPS"
            className={classNames(cls.GpsButton, { [cls.enabled]: gpsEnabled })}
        >
            <img src={gpsIcon} alt="" />
        </IconButton>
    );
};