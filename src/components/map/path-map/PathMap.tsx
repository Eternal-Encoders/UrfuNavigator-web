import { getRenderWay } from '../../../utils/path';
import { usePathMap } from './PathMapHook';

interface PathMapProps {
    institute: string
}

function PathMap({ institute }: PathMapProps) {
    const {path, currentFloor} = usePathMap();

    return (
        <>
            { path && path[institute] && path[institute][currentFloor] &&
                getRenderWay(path[institute][currentFloor])
            }
        </>
    )
}

export default PathMap;