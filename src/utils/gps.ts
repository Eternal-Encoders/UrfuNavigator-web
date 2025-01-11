import { EQUATORIAL_RADIUS, POLAR_RADIUS } from "./const";
import { IFloorGps, IInstituteGps, UserGps, UserLocation } from "./interfaces";

function approxGps(data: UserGps[]): UserGps {
    const sumOfData = data.reduce(
        (e, accum) => ({
            latitude: accum.latitude + e.latitude,
            longtitude: accum.longtitude + e.longtitude,
            altitude: accum.altitude + e.altitude
        }),
        {
            latitude: 0,
            longtitude: 0,
            altitude: 0
        }
    );

    return {
        latitude: sumOfData.latitude / data.length,
        longtitude: sumOfData.longtitude / data.length,
        altitude: sumOfData.altitude / data.length
    }
}

function boundGpsToMap(
    loc: {x: number, y: number},
    mapSize: {width: number, height: number})
    : {x: number, y: number} {
    return {
        x: Math.min(mapSize.width, Math.max(0, loc.x)),
        y: Math.min(mapSize.height, Math.max(0, loc.y))
    }
}

function deg2rad(x: number): number {
    return x * (Math.PI / 180);
}

function getClosestFloor(floors: IInstituteGps[], loc: UserGps): IInstituteGps {
    let min_index = 1;
    let min_value = Number.MAX_VALUE;

    for (let i=0; i<floors.length; i++) {
        const dist = Math.abs(floors[i].centre - loc.altitude);
        if (dist < min_value) {
            min_value = dist;
            min_index = i;
        }
    }

    return floors[min_index];
}

function flattenSphericalCoord(loc: UserGps): UserLocation {
    const lat_rad = deg2rad(loc.latitude);
    const long_rad = deg2rad(loc.longtitude);
    // const alt_rad = deg2rad(loc.altitude);

    const e2 = (EQUATORIAL_RADIUS**2 - POLAR_RADIUS**2) / EQUATORIAL_RADIUS**2;
    const nB = EQUATORIAL_RADIUS / Math.sqrt(1 - (e2 * Math.sin(lat_rad)**2));

    return {
        x: (nB + loc.altitude) * Math.cos(lat_rad) * Math.cos(long_rad) / 1e+3,
        y: (nB + loc.altitude) * Math.cos(lat_rad) * Math.sin(long_rad) / 1e+3,
        z: ((Math.pow(POLAR_RADIUS, 2) / Math.pow(EQUATORIAL_RADIUS, 2)) * nB + loc.altitude) * Math.sin(lat_rad)
    }
}

function createPredictor(mapGps: IFloorGps): (loc: UserGps) => {x: number, y: number} {
    function predictor(loc: UserGps): {x: number, y: number} {
        const flatCoord = flattenSphericalCoord(loc);

        const linearX = mapGps.linear.x.a + mapGps.linear.x.b1 * flatCoord.x + mapGps.linear.x.b2 * flatCoord.y;
        const linearY = mapGps.linear.y.a + mapGps.linear.y.b1 * flatCoord.x + mapGps.linear.y.b2 * flatCoord.y;

        let sumOfWeigths = 0;
        const weights = mapGps.forces.map((e) => {
            const dist = Math.sqrt(Math.pow(e.point.x - linearX, 2) + Math.pow(e.point.y - linearY, 2));
            const weight = 1.0 / Math.pow(dist + 1e-12, 2);
            sumOfWeigths += weight;

            return weight;
        });
        const normWeigths = weights.map(e => e / sumOfWeigths);

        return {
            x: linearX + normWeigths.reduce(
                (accum, currentValue, index) => accum + currentValue * mapGps.forces[index].force.x,
                0.0
            ),
            y: linearY + normWeigths.reduce(
                (accum, currentValue, index) => accum + currentValue * mapGps.forces[index].force.y,
                0.0
            )
        }
    }

    return predictor;
}

export {
    approxGps,
    boundGpsToMap,
    deg2rad,
    getClosestFloor,
    flattenSphericalCoord,
    createPredictor
}