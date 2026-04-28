import { useEffect, useState, useCallback } from "react";
import { useAppSelector } from "../../store/hook";
import { selectGps } from "../../features/rootData/rootDataSlice";

function useGeoPermission() {
    const [permissionState, setPermissionState] = useState<
        PermissionState | undefined
    >();

    useEffect(() => {
        let permission: PermissionStatus | undefined = undefined;
    
        if ("permissions" in navigator) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    permission = result;

                    setPermissionState(permission.state);
                    permission.onchange = () => {
                        if (permission) {
                            setPermissionState(permission.state);
                        }
                    };
                })
                .catch((e: unknown) => {
                    console.error("Error updating the permissions", e);
                });
        }
    
        return () => {
            if (permission) {
                permission.onchange = null;
            }
        };
    }, []);
    
    return {
        permissionState
    }
}

export function useGpsHook(bufferSize: number,) {
    const [userLoc, setUserLoc] = useState(new Array<GeolocationCoordinates>(bufferSize));
    const userGPSState = useAppSelector(selectGps)

    const { permissionState } = useGeoPermission();

    const sameCoords = (a: GeolocationCoordinates | undefined, b: GeolocationCoordinates | undefined) => {
        if (a === b) return true;
        if (!a || !b) return false;
        return a.altitude === b.altitude &&
            a.heading === b.heading &&
            a.latitude === b.latitude &&
            a.longitude === b.longitude
    };

    const watch_pos_call_back = useCallback((pos: GeolocationPosition) => {
        if (permissionState == 'granted' && userGPSState) {
            const prev_locs = [...userLoc]
            if (!sameCoords(prev_locs[prev_locs.length - 1], pos.coords)) {
                prev_locs.shift()
                prev_locs.push(pos.coords)
                setUserLoc(prev_locs)
            }
        }
    }, [permissionState, userLoc, userGPSState])

    useEffect(() => {
        let watchId = undefined
        if (userGPSState) {
            watchId = navigator.geolocation.watchPosition(watch_pos_call_back)
        }
        
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId)
            }
        }
    }, [navigator.geolocation, userGPSState, permissionState])

    return {
        userLoc,
        userGPSState,
        permissionState
    };
}