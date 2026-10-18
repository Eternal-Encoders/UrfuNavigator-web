import { skipToken } from '@reduxjs/toolkit/query';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { matchBuilding, useGetBuildingsQuery } from '@/entities/building';
import { selectFloor } from '@/entities/floor';
import { useSearchPointsQuery } from '@/entities/point';
import type { IGraphPoint, PointTypes } from '@/shared/api';
import { useAppSelector } from '@/shared/lib';
import { selectActiveSearchQuery } from './pointSearchSlice';

const PAGE_SIZE = 40;

interface SearchResultsState {
    points: IGraphPoint[] | undefined,
    isFetchingNext: boolean,
    loadMore: () => void
}

function searchKey(name: string, type: PointTypes | undefined, buildingId?: string, floorId?: string) {
    return `${name}\0${type ?? ''}\0${buildingId ?? ''}\0${floorId ?? ''}`;
}

export function useSearchResults(): SearchResultsState {
    const { name, type } = useAppSelector(selectActiveSearchQuery);
    const floorValue = useAppSelector(selectFloor);
    const { intstName } = useParams<{ intstName: string }>();
    const { data: buildings } = useGetBuildingsQuery(intstName ? undefined : skipToken);

    const building = intstName && buildings ? matchBuilding(buildings, intstName) : undefined;
    const buildingId = building?.id;
    const floorId = building?.floors.some((floor) => floor.id === floorValue) ? floorValue : undefined;

    const trimmedName = name.trim();
    const queryKey = searchKey(trimmedName, type, buildingId, floorId);
    const [trackedKey, setTrackedKey] = useState(queryKey);
    const [offset, setOffset] = useState(0);
    const [pages, setPages] = useState<IGraphPoint[][]>([]);

    const queryChanged = trackedKey !== queryKey;
    if (queryChanged) {
        setTrackedKey(queryKey);
        setOffset(0);
        setPages([]);
    }

    const pageOffset = queryChanged ? 0 : offset;
    const loadedPages = queryChanged ? [] : pages;
    const active = trimmedName.length > 0;

    const { currentData, isFetching, originalArgs } = useSearchPointsQuery(
        active
            ? {
                name: trimmedName,
                type,
                length: PAGE_SIZE,
                offset: pageOffset,
                buildingId,
                floorId,
            }
            : skipToken
    );

    const pageMatches = Boolean(
        currentData
        && originalArgs
        && originalArgs.name === trimmedName
        && originalArgs.type === type
        && originalArgs.buildingId === buildingId
        && originalArgs.floorId === floorId
        && originalArgs.offset === pageOffset
    );

    useEffect(() => {
        if (!pageMatches || !currentData) {
            return;
        }
        const pageIndex = pageOffset / PAGE_SIZE;
        setPages((current) => {
            if (current[pageIndex] === currentData) {
                return current;
            }
            const next = current.slice(0, pageIndex);
            next[pageIndex] = currentData;
            return next;
        });
    }, [currentData, pageMatches, pageOffset]);

    const currentPage = loadedPages[pageOffset / PAGE_SIZE];
    const hasMore = currentPage !== undefined && currentPage.length === PAGE_SIZE;
    const points = active && loadedPages.length > 0 ? loadedPages.flat() : undefined;

    const loadMore = useCallback(() => {
        if (!hasMore || isFetching) {
            return;
        }
        setOffset((value) => value + PAGE_SIZE);
    }, [hasMore, isFetching]);

    return {
        points,
        isFetchingNext: isFetching && pageOffset > 0 && loadedPages.length > 0,
        loadMore,
    };
}
