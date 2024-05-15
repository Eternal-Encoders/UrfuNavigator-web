import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { GlobalContext } from "../../contextes/GlobalContext";

import OpneSettingsBtn from "../../components/ui/open-settings-btn/OpenSettingsBtn";
import InstitutesModal from "../../components/ui/institutes-modal/institutes-list/InstitutesList";
import OpenSearchBtn from "../../components/ui/open-search-btn/OpenSearchBtn";
import SearchModal from "../../components/ui/search-modal/search-ui/SearchUi";
import SettingsModal from "../../components/ui/settings-modal/settings-ui/SettingsUi";

import { Helmet } from "react-helmet-async";
import { PointSearchTyping } from "../../utils/const";

import "./home-style.css";
import { IInstituteIcon } from "../../utils/interfaces";
import { findInstituteIcon } from "../../utils/server-connect";

function HomePage() {
    const { isSearchModal, isSettingsModal } = useContext(GlobalContext);
    const navigate = useNavigate();
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const [instLink, setInstLink] = useState<IInstituteIcon[]>([]);

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

    useEffect(() => {
        async function getInstLink() {
            await findInstituteIcon()
            .then((e) => setInstLink(e));
        }
        void getInstLink();
    }, [setInstLink]);

    return(
        <div className="container-home" style={{ height: window.innerHeight }}>
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
                    {instLink.map((e) => {
                        return (
                            <Placemark
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
            <div className="home-elements-div">
                <div className="search-div">
                    <OpneSettingsBtn/>
                    <OpenSearchBtn value={PointSearchTyping.homePageText} isHomePage={true}/>  
                </div>
                <InstitutesModal instLink={instLink} />
                { isSearchModal && <SearchModal/> }
                { isSettingsModal && <SettingsModal/> }
            </div>
        </div>
    )
}

export default HomePage;