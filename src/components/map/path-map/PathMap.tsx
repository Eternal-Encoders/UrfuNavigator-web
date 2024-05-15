import { useEffect, useState } from "react";
import { IGraphPoint, PointTypes } from "../../../utils/interfaces";
import { findDataByType } from "../../../utils/server-connect";
import { getRenderWay, getShortestPath } from "../../../utils/get-path";

import { RouteContext } from "../../../contextes/RouteContext";
import { useContext } from "react";

interface PathMapProps {
    institute: string,
    currentFloor: number
    from: IGraphPoint,
    to: IGraphPoint
}

// Заменить await'ы на Promise.All

function PathMap({institute, from, to, currentFloor}: PathMapProps) {
    const [path, setPath] = useState<{[inst: string]: {[floor: number]: IGraphPoint[][]}}>({});
    const { setFloors } = useContext(RouteContext);

    useEffect(() => {
        async function getPath() {
            if (from.institute === to.institute) {
                setPath({[from.institute]: await getShortestPath(from, to)});
            } else {
                const exits = {
                    from: await findDataByType(PointTypes.Exit, from.institute),
                    to: await findDataByType(PointTypes.Exit, to.institute)
                }
                setPath({
                    [from.institute]: await getShortestPath(from, exits.from[0]),
                    [to.institute]: await getShortestPath(to, exits.to[0])
                });
            }
        }
        void getPath();
    }, [from, to]);

    useEffect(() => {
        if (path[from.institute]) {
            setFloors({
                [from.institute]: Object.keys(path[from.institute]),
                [to.institute]: Object.keys(path[to.institute])
            });
        }
    }, [path]);

    return (
        <>
            { path[institute] && path[institute][currentFloor] &&
                getRenderWay(path[institute][currentFloor])
            }
        </>
   )
}

export default PathMap;