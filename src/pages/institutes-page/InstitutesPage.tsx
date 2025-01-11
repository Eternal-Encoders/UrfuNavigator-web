import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { useEffect } from 'react';
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

function InstitutesPage() {
    const dispatch = useAppDispatch()
    const {t} = useTranslation();

    const params = useParams<{intstName: string}>();
    const { data, isLoading } = useGetInstituteByUrlQuery(`/${params.intstName}`)

    useEffect(() => {
        dispatch(setContent(SideBarContent.Empty))
    })

    let instGps: IInstituteGps[] | null = null;

    if (data) {
        instGps = data.gps;
    }

    const userLoc = useGpsHook(
        GPS_BUFFER
    )

    console.log(userLoc)

    dispatch(floorSet(instGps ?  getClosestFloor(instGps, approxGps(userLoc)).floor : 1));

    return (
        <>
            {!isLoading && data ?
                <>
                    <Helmet>
                        <title>{data.name} — Навигатор УрФУ</title>
                        <meta
                            name="description"
                            content={`Страница навигации по ${data.name} УрФУ`}
                        />
                        <meta 
                            name="viewport" 
                            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                    </Helmet>
                    <MapUI 
                        instFullName={data.name} 
                        firstFloor={data.minFloor} 
                        lastFloor={data.maxFloor} 
                    />
                    <ToRenderMap 
                        instFullName={data.name} 
                        firstFloor={data.minFloor} 
                        lastFloor={data.minFloor}
                        userLoc={approxGps(userLoc)}
                    />
                </>:
                <>
                    <Helmet>
                        <title>Загрузка</title>
                        <meta
                            name="description"
                            content={'Страница загрузки'}
                        />
                        <meta 
                            name="viewport" 
                            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
                        />
                    </Helmet>
                    {t('Wait')}
                </>
            }
        </>
        
    )
}

export default InstitutesPage