import { useParams, redirect } from "react-router-dom";
import ToRenderMap from "../../components/map/to-render-map/ToRenderMap";
import MapUI from "../../components/ui/map-ui/MapUi";
import { Helmet } from "react-helmet-async";
import { useLayoutEffect, useState } from "react";
import { findInstituteByUrl } from "../../utils/server-connect";

function InstitutesPage() {
    const data = useParams<{intstName: string}>();
    const [instName, setInstName] = useState("");
    const [firstFloor, setFirstFloor] = useState(1);
    const [lastFloor, setLastFloor] = useState(1);
    
    useLayoutEffect(() => {
        async function getInst() {
            if (data.intstName) {
                await findInstituteByUrl(`/${data.intstName}`)
                .then((e) => {
                    setInstName(e.name);
                    setFirstFloor(e.minFloor);
                    setLastFloor(e.maxFloor);
                })
                .catch(() => redirect("/"));
            }
        }
        void getInst();
    })

    return (
        <>
            <Helmet>
                <title>{instName} — Навигатор УрФУ</title>
                <meta
                    name="description"
                    content={`Страница навигации по ${instName} УрФУ`}
                />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
            </Helmet>
            <MapUI instFullName={instName} firstFloor={firstFloor} lastFloor={lastFloor} />
            {instName !== "" &&
                <ToRenderMap instFullName={instName} firstFloor={firstFloor} lastFloor={lastFloor}/>
            }
        </>
        
    )
}

export default InstitutesPage