import { useEffect, useState } from "react";
import { UserGps } from "../../utils/interfaces";
import { useGeolocated } from "react-geolocated";

export function useGpsHook(bufferSize: number) {
    const [userLoc, setUserLoc] = useState(new Array<UserGps>(bufferSize));
    const [heading, setHeading] = useState<number>(0);

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
            setHeading(coords.heading ? coords.heading : 0);
        }
        
    }, [coords])

    return {
        userLoc,
        heading
    };
}