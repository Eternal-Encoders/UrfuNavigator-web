import { skipToken } from '@reduxjs/toolkit/query';
import { useGetPointsQuery, useSearchPointsQuery } from '@/entities/point';
import type { IGraphPoint } from '@/shared/api';
import { useAppSelector } from '@/shared/lib';
import { selectActiveSearchQuery } from './pointSearchSlice';

const RESULTS_LIMIT = 40;

export function useSearchResults(): IGraphPoint[] | undefined {
    const { name, type } = useAppSelector(selectActiveSearchQuery);
    const trimmedName = name.trim();

    const { data: pointsByType } = useGetPointsQuery(type ? { type, length: RESULTS_LIMIT } : skipToken);
    const { data: pointsByName } = useSearchPointsQuery(
        type || !trimmedName
            ? skipToken
            : { name: trimmedName, length: RESULTS_LIMIT }
    );

    return type ? pointsByType : pointsByName;
}
