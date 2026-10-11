import { BuildingLink, useGetBuildingsQuery } from '@/entities/building';

export function InstitutesList() {
    const { data: buildings = [] } = useGetBuildingsQuery();

    return (
        <ul className="grid w-full grid-cols-4">
            {buildings.map((building) => (
                <li key={building.id} className="flex justify-center">
                    <BuildingLink building={building} />
                </li>
            ))}
        </ul>
    );
}
