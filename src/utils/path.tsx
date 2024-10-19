import React from 'react';
import { Path } from '../components/konva-components';
import { IGraphPoint } from './interfaces';
import { Group } from 'react-konva';


function getRenderWay(points: IGraphPoint[][]): React.ReactNode {
    return (
        <Group>
            {points.map((e, index) =>
                <Path key={index} points={e.map((point) => [point.x, point.y]).flat()} />
            )}
        </Group>
    );
}

export { getRenderWay };
