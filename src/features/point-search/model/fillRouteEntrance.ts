import { pointApi } from '@/entities/point';
import { selectRoutePoints, setDefaultFromPoint } from '@/entities/route';
import { PointTypes, type IBuilding, type IGraphPoint } from '@/shared/api';

export function chooseRouteEntrance(points: IGraphPoint[], buildingId: string, floorId: string) {
    const main = (point: IGraphPoint) => /главн.{0,12}вход|main entrance/i.test(
        [point.displayableName, ...point.names.map(name => name.name)].join(' '));
    return points.filter(point => point.buildingId === buildingId && point.floorId === floorId
        && point.types.includes(PointTypes.Exit) && Number.isFinite(point.x) && Number.isFinite(point.y))
        .sort((a, b) => Number(main(b)) - Number(main(a)) || a.id.localeCompare(b.id))[0];
}

/** Capture source before destination navigation; stale responses cannot overwrite route edits. */
export function fillRouteEntrance(building: IBuilding, destinationId?: string) {
    return async (dispatch: AppDispatch, getState: () => RootState) => {
        const route = selectRoutePoints(getState());
        const floorId = building.floors.find(floor => Number(floor.displayableName) === 1)?.id;
        if (route.from || route.to?.id !== destinationId || !floorId) return;
        try {
            const points = await dispatch(pointApi.endpoints.getPoints.initiate({
                buildingId: building.id, floorId, type: PointTypes.Exit, length: 100
            }, { subscribe: false })).unwrap();
            const point = chooseRouteEntrance(points, building.id, floorId);
            if (point) dispatch(setDefaultFromPoint({ point, destinationId, revision: route.revision }));
        } catch { /* Missing entrance/network failure leaves From available for manual selection. */ }
    };
}
