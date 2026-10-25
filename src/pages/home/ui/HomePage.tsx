import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CAMPUSES, selectCampusState } from '@/entities/campus';
import { instituteRoute, useGetBuildingsQuery } from '@/entities/building';
import { SideBarContent, setMainContent } from '@/entities/sidebar';
import { selectScreenSize, setPageReady } from '@/entities/viewer';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { MapSkeleton } from '@/shared/ui';

export default function HomePage() {
    const navigate = useNavigate();
    const [mapLoading, setMapLoading] = useState(true);
    const [map, setMap] = useState<ymaps.Map | null>(null);
    const { selected, version } = useAppSelector(selectCampusState);
    const campus = CAMPUSES.find(item => item.id === selected && item.available) ?? CAMPUSES[0];
    useEffect(() => {
        if (map && campus.center) void map.setCenter([...campus.center], 15, { duration: version ? 350 : 0 });
    }, [map, campus, version]);
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const { innerWidth, innerHeight } = useAppSelector(selectScreenSize)
    const { data, isLoading } = useGetBuildingsQuery()

    useEffect(() => {
        dispatch(setPageReady(!mapLoading && !isLoading));
    }, [dispatch, mapLoading, isLoading]);

    useEffect(() => {
        dispatch(setMainContent(SideBarContent.Institutes))
    }, [dispatch]);

    return (
        <div className="relative flex w-full flex-col" style={{ height: innerHeight }}>
            <Helmet>
                <title>{t('UrfuNavigatorTitle')}</title>
                <meta name="description" content={t('HomePageDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <div data-map-interaction>
                <YMaps>
                    <Map
                        instanceRef={setMap}
                        onLoad={() => setMapLoading(false)}
                        onError={() => setMapLoading(false)}
                        height={innerHeight}
                        width={innerWidth}
                        defaultState={{
                            center: campus.center ? [...campus.center] : [56.842, 60.652],
                            zoom: 15
                        }}
                    >
                        {data?.map((building) => (
                            <Placemark
                                key={building.id}
                                onClick={() => navigate(instituteRoute(building))}
                                geometry={[building.latitude, building.longitude]}
                                properties={{
                                    iconContent: building.displayableName,
                                    hintContent: building.displayableName
                                }}
                                options={{
                                    preset: 'islands#blackStretchyIcon'
                                }}
                            />
                        ))}
                    </Map>
                </YMaps>
            </div>
            {mapLoading && <div className="pointer-events-none absolute inset-0"><MapSkeleton label={t('Loading')} /></div>}
        </div>
    )
}
