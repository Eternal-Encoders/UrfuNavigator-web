import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { Helmet } from "react-helmet-async";

import { useGetInstitutesQuery } from "../../features/api/apiSlice";
import { useAppDispatch } from "../../store/hook";

import styles from "./home-style.module.css";
import { setContent } from "../../features/sideBar/sideBarSlice";
import { SideBarContent } from "../../utils/interfaces";
import SideMenu from "../../components/ui/side-bar/side-menu/SideMenu";

function HomePage() {
    const navigate = useNavigate();

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);


    const dispatch = useAppDispatch()
    const { data } = useGetInstitutesQuery(undefined)

    useEffect(() => {
        dispatch(setContent(SideBarContent.Institutes))

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
            <SideMenu />
        </div>
    )
}

export default HomePage;