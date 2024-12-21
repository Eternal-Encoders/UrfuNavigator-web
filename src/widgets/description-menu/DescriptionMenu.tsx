import { useGetPointByIdQuery } from "../../features/api/apiSlice";
import { selectPointData } from "../../features/descMenu/descMenuSlice"
import { useAppSelector } from "../../store/hook"

function DescriptionMenu() {
    const pointId = useAppSelector(selectPointData);
    const { data } = useGetPointByIdQuery(pointId ? pointId : '')

    return (
        <>
        {pointId && data &&
            <div>
                {data.names.join(', ')}
            </div>
        }
        </>
    );
}

export default DescriptionMenu