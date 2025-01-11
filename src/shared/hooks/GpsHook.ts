import { useEffect, useState } from "react";
import { UserGps } from "../../utils/interfaces";
import { useGeolocated } from "react-geolocated";

export function useGpsHook(bufferSize: number) {
    const [userLoc, setUserLoc] = useState(new Array<UserGps>(bufferSize));

    const { coords } = useGeolocated({
        positionOptions: {
            enableHighAccuracy: true,
            maximumAge: 0
        },
        watchPosition: true,
        suppressLocationOnMount: false,
        geolocationProvider: navigator.geolocation,
        isOptimisticGeolocationEnabled: true,
        watchLocationPermissionChange: false,
    })

    useEffect(() => {
        if (coords) {
            userLoc.shift()
            userLoc.push({
                latitude: coords.latitude,
                longtitude: coords.longitude,
                altitude: coords.altitude ? coords.altitude : 268.4
            })
            setUserLoc(userLoc);
        }
        
    }, [coords])

    /* ON MOUNT - GET CURRENT GPS */
    // useEffect(() => {
    //     if (navigator.geolocation && isGpsAv) {
    //         navigator.geolocation.getCurrentPosition(
    //             (pos) => {
    //                 setUserLoc(userLoc.fill({
    //                     latitude: pos.coords.latitude,
    //                     longtitude: pos.coords.longitude,
    //                     altitude: pos.coords.altitude ? pos.coords.altitude : 268.4
    //                 }))
    //             }
    //         )

    //         navigator.geolocation.watchPosition(
    //             (pos) => {
    //                 userLoc.shift()
    //                 userLoc.push({
    //                     latitude: pos.coords.latitude,
    //                     longtitude: pos.coords.longitude,
    //                     altitude: pos.coords.altitude ? pos.coords.altitude : 268.4
    //                 })
    //                 setUserLoc(userLoc);
    //             },
    //             () => {},
    //             {
    //                 maximumAge: 0,
    //                 enableHighAccuracy: true,
    //             }
    //         )
    //     }
    // }, [navigator]);

    return userLoc;
}