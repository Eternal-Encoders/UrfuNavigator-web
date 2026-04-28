import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ToRenderMap from '../../components/map/to-render-map/ToRenderMap';
import { useGetInstituteByUrlQuery } from '../../features/api/apiSlice';
import { setContent } from '../../features/sideBar/sideBarSlice';
import { useAppDispatch } from '../../store/hook';
import { IInstituteGps, SideBarContent } from '../../utils/interfaces';
import MapUI from '../../widgets/map-ui/MapUi';
import { useGpsHook } from '../../shared/hooks/GpsHook';
import { GPS_BUFFER } from '../../utils/const';
import { approxGps, getClosestFloor } from '../../utils/gps';
import { floorSet } from '../../features/floor/floorSlice';
import { InstLinks } from '../../utils/const';

const instTranslations = new Map<string, string>();
InstLinks.forEach((k, v) => {
    instTranslations.set(k.replace('/', ''), v);
});

function InstitutesPage() {
    const dispatch = useAppDispatch()

    const [mapGps, setMapGps] = useState<IInstituteGps[] | undefined>(undefined)

    const params = useParams<{intstName: string}>();
    const { t } = useTranslation();
    const { userLoc, userGPSState } = useGpsHook(
        GPS_BUFFER
    )

    const { data, isLoading } = useGetInstituteByUrlQuery(`/${params.intstName}`)

    useEffect(() => {
        dispatch(setContent(SideBarContent.Empty))
        dispatch(floorSet({
            floor: 1,
            priority: 0
        }))
    })

    useEffect(() => {
        if (data) {
            if (data.gps && userGPSState) {
                setMapGps(data.gps)
                floorSet({
                    floor: getClosestFloor(data.gps, approxGps(userLoc)).floor,
                    priority: 0
                })
            } else if (mapGps) {
                setMapGps(undefined)
            }
        }
    }, [data, userGPSState])


    let headerName = params.intstName
    headerName = headerName ? instTranslations.get(headerName) : 'undefined'

    return (
        <>
            {headerName ?
                <Helmet>
                    <title>{`${headerName} — Навигатор УрФУ`}</title>
                    <meta
                        name="description"
                        content={`Страница навигации по ${headerName} УрФУ`}
                    />
                    <meta 
                        name="viewport" 
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                </Helmet>
            :
                <>
                    <Helmet>
                        <title>Загрузка</title>
                        <meta
                            name="description"
                            content='Страница загрузки'
                        />
                        <meta 
                            name="viewport" 
                            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
                        />
                    </Helmet>
                    {t('Wait')}
                </>
            }
            
            {!isLoading && data &&
                <>
                    <MapUI 
                        instFullName={data.name} 
                        firstFloor={data.minFloor} 
                        lastFloor={data.maxFloor} 
                    />
                    <ToRenderMap
                        {...data}
                        userGps={approxGps(userLoc)}
                        mapGps={mapGps}
                    />
                </>
            }
        </>
        
    )
}

export default InstitutesPage