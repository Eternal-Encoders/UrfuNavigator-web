import { sortedFloors } from '@/entities/building';
import { floorSet, selectFloor } from '@/entities/floor';
import { selectRoutePoints } from '@/entities/route';
import type { IFloorSummary } from '@/shared/api';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';

interface FloorSwitcherProps {
    buildingId: string,
    floors: IFloorSummary[]
}

export function FloorSwitcher({ buildingId, floors }: FloorSwitcherProps) {
    const dispatch = useAppDispatch()
    const currentFloor = useAppSelector(selectFloor)
    const points = useAppSelector(selectRoutePoints)

    return (
        <ul className="flex flex-col gap-1.5 rounded-xl border bg-card p-1.5 shadow-subtle">
            {sortedFloors(floors).map((floor) => {
                const isActive = currentFloor === floor.id
                const onTheWay =
                    (points.from?.floorId === floor.id && points.from.buildingId === buildingId) ||
                    (points.to?.floorId === floor.id && points.to.buildingId === buildingId)

                return (
                    <li key={floor.id}>
                        <Button
                            variant={isActive ? 'default' : 'outline'}
                            size="icon-lg"
                            aria-pressed={isActive}
                            className={cn(
                                'font-medium',
                                !isActive && 'bg-secondary text-muted-foreground',
                                onTheWay && 'ring-2 ring-route ring-offset-1 ring-offset-card'
                            )}
                            onClick={() => dispatch(floorSet({ floor: floor.id, priority: 1 }))}
                        >
                            {floor.displayableName}
                        </Button>
                    </li>
                )
            })}
        </ul>
    )
}
