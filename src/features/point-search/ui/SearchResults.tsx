import { buildingAccent, useGetBuildingsQuery } from '@/entities/building';
import { pointNameList } from '@/entities/point';
import { useSearchResults } from '../model/useSearchResults';
import { useSelectPoint } from '../model/useSelectPoint';

function preventPassThrough(e: React.TouchEvent<HTMLUListElement>) {
    e.preventDefault();
    e.stopPropagation();
}

export function SearchResults() {
    const data = useSearchResults();
    const selectPoint = useSelectPoint();
    const { data: buildings } = useGetBuildingsQuery();

    if (!data) {
        return null;
    }

    return (
        <ul
            className="size-full overflow-auto px-5"
            onTouchStart={preventPassThrough}
            onTouchMove={preventPassThrough}
        >
            {data.map((point) => {
                const building = buildings?.find((item) => item.id === point.buildingId);
                return (
                    <li key={point.id}>
                        <button
                            type="button"
                            className="flex w-full flex-col gap-0.5 border-b py-2 text-left outline-none hover:bg-muted/60 focus-visible:bg-muted"
                            onClick={() => selectPoint(point)}
                        >
                            <span className="text-sm font-medium text-foreground">
                                {pointNameList(point).join(', ')}
                            </span>
                            <span className="flex items-center gap-1">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: buildingAccent(building) }}
                                />
                                <span className="text-xs font-medium text-muted-foreground">
                                    {building?.displayableName}
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );
}
