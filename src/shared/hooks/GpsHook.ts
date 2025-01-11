import { useEffect, useState } from "react";
import { UserGps } from "../../utils/interfaces";

export function useGpsHook(isGpsAv: boolean, bufferSize: number) {
    const [userLoc, setUserLoc] = useState(new Array<UserGps>(bufferSize));

    /* ON MOUNT - GET CURRENT GPS */
    useEffect(() => {
        if (navigator.geolocation && isGpsAv) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLoc(userLoc.fill({
                        latitude: pos.coords.latitude,
                        longtitude: pos.coords.longitude,
                        altitude: pos.coords.altitude ? pos.coords.altitude : 268.4
                    }))
                }
            )
        }
    }, []);

    /* ON GPS UPDATE */
    useEffect(() => {
        if (navigator.geolocation && isGpsAv) {
            navigator.geolocation.watchPosition(
                (pos) => {
                    userLoc.shift()
                    userLoc.push({
                        latitude: pos.coords.latitude,
                        longtitude: pos.coords.longitude,
                        altitude: pos.coords.altitude ? pos.coords.altitude : 268.4
                    })
                    setUserLoc(userLoc);
                },
                () => {},
                {
                    enableHighAccuracy: true,
                }
            )
        }
    }, [navigator.geolocation]);

    return userLoc;
}