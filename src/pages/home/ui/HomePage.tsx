import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { instituteRoute, useGetBuildingsQuery } from '@/entities/building';
import { SideBarContent, setContent } from '@/entities/sidebar';
import { selectScreenSize } from '@/entities/viewer';
import { apiErrorText } from '@/shared/api';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { SideMenu } from '@/widgets/side-menu';

export default function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const dispatch = useAppDispatch()
    const { innerWidth, innerHeight } = useAppSelector(selectScreenSize)
    const { data, error } = useGetBuildingsQuery()
    const buildingsError = apiErrorText(error)

    useEffect(() => {
        dispatch(setContent(SideBarContent.Institutes))
    }, [dispatch]);

    return (
        <div className="relative flex w-full flex-col" style={{ height: innerHeight }}>
            <Helmet>
                <title>{t('UrfuNavigatorTitle')}</title>
                <meta name="description" content={t('HomePageDescription')} />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>
            <YMaps>
                <Map
                    height={innerHeight}
                    width={innerWidth}
                    defaultState={{
                        center: [56.842, 60.652],
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
            {buildingsError &&
                <p className="text-destructive">{buildingsError}</p>
            }
            <SideMenu />
        </div>
    )
}
