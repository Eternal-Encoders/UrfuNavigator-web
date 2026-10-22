import type { ComponentProps } from 'react';
import { cn } from '@/shared/lib/utils';

export function Skeleton({ className, ...props }: ComponentProps<'div'>) {
    return <div {...props} aria-hidden="true" className={cn('skeleton', className)} />;
}

export function ListSkeleton({ label, rows = 4 }: { label: string, rows?: number }) {
    return <div className="loading-list" role="status" aria-label={label} aria-busy="true">
        {Array.from({ length: rows }, (_, i) => <div className="loading-list-row" key={i}>
            <Skeleton className="size-6 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-2">
                <Skeleton className={i % 2 ? 'h-3 w-2/3' : 'h-3 w-1/2'} />
                <Skeleton className="h-2 w-1/3" />
            </div>
        </div>)}
    </div>;
}

export function MapSkeleton({ label }: { label: string }) {
    return <div className="map-skeleton" role="status" aria-label={label} aria-busy="true">
        <div className="grid w-[min(680px,78%)] grid-cols-6 gap-2.5" aria-hidden="true">
            <Skeleton className="col-span-4 h-16" />
            <Skeleton className="col-span-2 row-span-3 min-h-24" />
            <Skeleton className="col-span-2 h-28" />
            <Skeleton className="col-span-2 h-28" />
            <Skeleton className="col-span-4 h-8" />
            <Skeleton className="col-span-2 h-24" />
            <Skeleton className="col-span-2 h-24" />
            <Skeleton className="h-24" /><Skeleton className="h-24" />
        </div>
    </div>;
}
