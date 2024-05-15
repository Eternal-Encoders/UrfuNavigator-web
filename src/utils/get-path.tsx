import React from "react";
import { Path } from "../components/konva-components";
import { IGraphPoint, IStair } from "./interfaces";
import { findGraph, findStairs } from "./server-connect";
import { Group } from "react-konva";
import { PriorityQueue } from "./PriorityQueue";

interface IQueueData {
    id: string,
    floor: number,
    priority: number
}

function restoreAStarPath(
    graph: {[floor: number]: {[id: string]: IGraphPoint}},
    cameFrom: {[id: string]: IQueueData}, 
    start: IGraphPoint, 
    end: IGraphPoint
): {[floor: number]: IGraphPoint[][]} {
    const result: {[floor: number]: IGraphPoint[][]} = {[end.floor]: [[]]};
    let current: IQueueData = {id: end.id, floor: end.floor, priority: 0};
    let prevFloor = -100;

    while (current.id !== start.id) {
        result[current.floor][result[current.floor].length - 1].push(graph[current.floor][current.id]);
        prevFloor = current.floor;
        current = cameFrom[current.id];
        if (prevFloor !== current.floor) {
            if (!result[current.floor]) {
                result[current.floor] = [[]];
            } else {
                result[current.floor].push([]);
            }
        }
    }
    result[prevFloor][result[prevFloor].length - 1].push(start);

    return result;
}

function getNeigbours(current: IGraphPoint, stairs: {[id:string]: IStair}) {
    const allLinks: IQueueData[] = [...current.links.map(e => {
        return {id: e, floor: current.floor, priority: 0}
    })];
    if (stairs[current.id]) {
        stairs[current.id].links.reduce((prev, curr) => {
            prev.push({id: curr.stairPoint.id, floor: curr.stairPoint.floor, priority: 0})
            return prev;
        }, allLinks);
    }
    return allLinks;
}

function graphCost(a: IGraphPoint, b:IGraphPoint): number {
    if ("stairId" in a && "stairId" in b) {
        return 1000
    } else {
        return 10;
    }
}

function heuristic(a: IGraphPoint, b: IGraphPoint): number {
    if (a.floor === b.floor) {
        return Math.pow((Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)), 0.5);
    } else {
        return -(2000 / (Math.abs(a.floor - b.floor) + 1))
    }
   
}

async function getShortestPath(
        start: IGraphPoint, 
        end: IGraphPoint
    ): Promise<{[floor: number]: IGraphPoint[][]} >{
    const toSearch = new PriorityQueue<IQueueData>((a, b) => a.priority < b.priority);
    const cameFrom: {[id: string]: IQueueData} = {}
    const costsoFar: {[id: string]: number} = {}
    
    const graph = {
        [start.floor]: await findGraph(start.institute, start.floor)
    };
    const stairs = (await findStairs(start.institute)).reduce((obj, stairPoint) => {
        obj[stairPoint.stairPoint.id] = stairPoint;
        return obj
    }, {} as {[id:string]: IStair});

    toSearch.push({id: start.id, floor: start.floor, priority: 0});
    costsoFar[start.id] = 0;

    while (!toSearch.isEmpty()) {
        const current = toSearch.pop();

        if (current.id === end.id) {
            break;
        }

        const currentVertex = graph[current.floor][current.id];
        for (const next of getNeigbours(currentVertex, stairs)) {
            if (!graph[next.floor]) {
                graph[next.floor] = await findGraph(start.institute, next.floor)
            }

            const nextVertex = graph[next.floor][next.id];
            const newCost = costsoFar[current.id] + graphCost(currentVertex, nextVertex);
            if (!(next.id in costsoFar) || newCost < costsoFar[next.id]) {
                costsoFar[next.id] = newCost;
                next.priority = newCost + heuristic(end, nextVertex);
                toSearch.push(next);
                cameFrom[next.id] = current;
            }
        }
    }

    return restoreAStarPath(graph, cameFrom, start, end);
}

function getRenderWay(points: IGraphPoint[][]): React.ReactNode {
    return (
        <Group>
            {points.map((e, index) =>
                <Path key={index} points={e.map((point) => [point.x, point.y]).flat()} />
            )}
        </Group>
    );
}

export { getShortestPath, getRenderWay };
