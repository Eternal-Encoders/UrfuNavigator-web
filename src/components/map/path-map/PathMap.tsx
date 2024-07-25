import { useEffect, useState } from "react";
import { IGraphPoint, PointTypes } from "../../../utils/interfaces";
import { getRenderWay } from "../../../utils/path";

interface PathMapProps {
    institute: string,
    currentFloor: number
    from: IGraphPoint,
    to: IGraphPoint
}

// Заменить await'ы на Promise.All

function PathMap({institute, from, to, currentFloor}: PathMapProps) {
    const [path, setPath] = useState<{[inst: string]: {[floor: number]: IGraphPoint[][]}}>({});

    // useEffect(() => {
    //     async function getPath() {
    //         if (from.institute === to.institute) {
    //             setPath({[from.institute]: await getShortestPath(from, to)});
    //         } else {
    //             const exits = {
    //                 from: await findDataByType(PointTypes.Exit, from.institute),
    //                 to: await findDataByType(PointTypes.Exit, to.institute)
    //             }
    //             setPath({
    //                 [from.institute]: await getShortestPath(from, exits.from[0]),
    //                 [to.institute]: await getShortestPath(to, exits.to[0])
    //             });
    //         }
    //     }
    //     void getPath();
    // }, [from, to]);

    return (
        <>
            { path[institute] && path[institute][currentFloor] &&
                getRenderWay(path[institute][currentFloor])
            }
        </>
   )
}

export default PathMap;