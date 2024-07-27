import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Helmet } from "react-helmet-async";

import { useGetInstitutesQuery } from "../../features/api/apiSlice";
import { useAppSelector } from "../../store/hook";
import { selectSearchModal, selectSettingsModal } from "../../features/modals/modalsSlice";
import OpneSettingsBtn from "../../components/ui/open-settings-btn/OpenSettingsBtn";
import InstitutesModal from "../../components/ui/institutes-modal/institutes-list/InstitutesList";
import OpenSearchBtn from "../../components/ui/open-search-btn/OpenSearchBtn";
import SearchModal from "../../components/ui/search-modal/search-ui/SearchUi";
import SettingsModal from "../../components/ui/settings-modal/settings-ui/SettingsUi";

import styles from "./home-style.module.css";

function HomePage() {
    const navigate = useNavigate();

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const { data } = useGetInstitutesQuery(undefined)
    const isSearchModal = useAppSelector(selectSearchModal)
    const isSettingsModal = useAppSelector(selectSettingsModal)

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        }
        
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return(
        <div className={styles['container-home']} style={{ height: window.innerHeight }}>
            <Helmet>
                <title>Навигатор УрФУ</title>
                <meta
                    name="description"
                    content="Это навигатор по УрФУ для всех, кто испытывает сложности с ориентированием внутри зданий унивирситета."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>
            <YMaps>
                <Map
                    height={height}
                    width={width}
                    defaultState={{ 
                        center: [56.842, 60.652], 
                        zoom: 15 
                    }}
                >
                    {data && data.map((e) => {
                        return (
                            <Placemark
                                key={`/institute/${e.url[0] === "/" ? e.url.slice(1): e.url}`}
                                onClick={() => navigate(`/institute/${e.url[0] === "/" ? e.url.slice(1): e.url}`)}
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
            <div className={styles['home-elements-div']}>
                <div className={styles['search-div']}>
                    <OpneSettingsBtn/>
                    <OpenSearchBtn isEnd={false} isHomePage={true}/>  
                </div>
                <InstitutesModal instLink={data ? data: []} />
                { isSearchModal && <SearchModal isStartPressed={false} /> }
                { isSettingsModal && <SettingsModal /> }
            </div>
        </div>
    )
}

export default HomePage;