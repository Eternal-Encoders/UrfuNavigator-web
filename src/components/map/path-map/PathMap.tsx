import { IPath } from "../../../utils/interfaces";
import { getRenderWay } from "../../../utils/path";
import { useAppSelector } from "../../../store/hook";
import { selectSearchPoints } from "../../../features/pointsSearch/pointsSearchSlice";
import { selectFloor } from "../../../features/floor/floorSlice";
import { useGetPathQuery } from "../../../features/api/apiSlice";

interface PathMapProps {
    institute: string
}

function PathMap({ institute }: PathMapProps) {
    const path: {[inst: string]: IPath} = {}
    const points = useAppSelector(selectSearchPoints)
    const currentFloor = useAppSelector(selectFloor)

    if (points.from && points.to) {
        if (points.from.institute === points.to.institute) {
            const { data } = useGetPathQuery({
                from: points.from.id, 
                to: points.to.id
            })
            if (data) {
                path[points.from.institute] = data
            }
        } else {
            // const { data: exitsData } = useGetPointsByTypeQuery({
            //     type: PointTypes.Exit,
            //     institute: points.from.institute
            // })
            // const { data: entersData } = useGetPointsByTypeQuery({
            //     type: PointTypes.Exit,
            //     institute: points.to.institute
            // })

            // if (exitsData) {
            //     const { data: firstData } = useGetPathQuery({
            //         from: points.from.id, 
            //         to: exitsData[0].id
            //     })
            //     if (firstData) {
            //         path[points.from.institute] = firstData
            //     } 
                
            // }
            // if (entersData) {
            //     const { data: secondData } = useGetPathQuery({
            //         from: entersData[0].id, 
            //         to: points.to.id
            //     })
            //     if (secondData) {
            //         path[points.from.institute] = secondData
            //     } 
            // }
        }
    }

    return (
        <>
            { path[institute] && path[institute][currentFloor] &&
                getRenderWay(path[institute][currentFloor])
            }
        </>
   )
}

export default PathMap;