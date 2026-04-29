import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useGetInstitutesQuery } from '../../features/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../../store/hook';

import { setContent } from '../../features/sideBar/sideBarSlice';
import { SideBarContent } from '../../utils/interfaces';
import SideMenu from '../../widgets/side-bar/side-menu/SideMenu';
import styles from './HomePage.module.scss';
import { selectScreenSize } from '../../features/rootData/rootDataSlice';

function HomePage() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { innerWidth, innerHeight } = useAppSelector(selectScreenSize)

    const dispatch = useAppDispatch()
    const { data } = useGetInstitutesQuery(undefined)

    useEffect(() => {
        dispatch(setContent(SideBarContent.Institutes))
    }, [dispatch]);

    return(
        <div className={styles['ContainerHome']} style={{ height: innerHeight }}>
            <Helmet>
                <title>{t('UrfuNavigatorTitle')}</title>
                <meta
                    name="description"
                    content={t('HomePageDescription')}
                />
                <meta 
                    name="viewport" 
                    content="width=device-width, initial-scale=1.0" />
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
                    {data && data.map((e) => {
                        const institutePath = `/institute/${e.url[0] === '/' ? e.url.slice(1): e.url}`;
                        return (
                            <Placemark
                                key={institutePath}
                                onClick={() => navigate(institutePath)}
                                geometry={[e.latitude, e.longitude]}
                                properties={{
                                    iconContent: e.displayableName,
                                    hintContent: e.displayableName
                                }}
                                options={{
                                    preset: 'islands#blackStretchyIcon'
                                }}
                            />
                        );
                    })}
                </Map>
            </YMaps>
            <SideMenu />
        </div>
    )
}

export default HomePage;