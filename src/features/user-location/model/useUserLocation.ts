import { useEffect, useState, useCallback } from 'react';
import { selectGps } from '@/entities/viewer';
import { useAppSelector } from '@/shared/lib';

function useGeoPermission() {
    const [permissionState, setPermissionState] = useState<
        PermissionState | undefined
    >();

    useEffect(() => {
        let permission: PermissionStatus | undefined = undefined;

        if ('permissions' in navigator) {
            navigator.permissions
                .query({ name: 'geolocation' })
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
                    console.error('Error updating the permissions', e);
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

function sameCoords(a: GeolocationCoordinates | undefined, b: GeolocationCoordinates | undefined) {
    if (a === b) return true;
    if (!a || !b) return false;
    return a.altitude === b.altitude &&
        a.heading === b.heading &&
        a.latitude === b.latitude &&
        a.longitude === b.longitude
}

export function useUserLocation(bufferSize: number) {
    const [userLoc, setUserLoc] = useState(() => new Array<GeolocationCoordinates>(bufferSize));
    const userGPSState = useAppSelector(selectGps)

    const { permissionState } = useGeoPermission();

    const watchPosCallback = useCallback((pos: GeolocationPosition) => {
        if (permissionState == 'granted' && userGPSState) {
            setUserLoc((prevLocs) => {
                if (sameCoords(prevLocs[prevLocs.length - 1], pos.coords)) {
                    return prevLocs
                }
                return [...prevLocs.slice(1), pos.coords]
            })
        }
    }, [permissionState, userGPSState])

    useEffect(() => {
        if (!userGPSState) {
            return
        }
        const watchId = navigator.geolocation.watchPosition(watchPosCallback)

        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [userGPSState, watchPosCallback])

    return {
        userLoc,
        userGPSState,
        permissionState
    };
}
