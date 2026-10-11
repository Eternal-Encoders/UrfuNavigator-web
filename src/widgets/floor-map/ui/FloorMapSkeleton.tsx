import { cn } from '@/shared/lib';

const block = 'rounded-md bg-muted';

export function FloorMapSkeleton() {
    return (
        <div
            className="flex size-full items-center justify-center bg-background desktop:pl-(--panel-width)"
            role="status"
            aria-label="Loading"
        >
            <div className="grid w-[min(680px,78%)] animate-pulse grid-cols-6 gap-2.5">
                <div className={cn(block, 'col-span-4 h-16')} />
                <div className={cn(block, 'col-span-2 row-span-3 h-full min-h-24')} />
                <div className={cn(block, 'col-span-2 h-28')} />
                <div className={cn(block, 'col-span-2 h-28')} />
                <div className={cn(block, 'col-span-4 h-8')} />
                <div className={cn(block, 'col-span-2 h-24')} />
                <div className={cn(block, 'col-span-2 h-24')} />
                <div className={cn(block, 'h-24')} />
                <div className={cn(block, 'h-24')} />
            </div>
        </div>
    );
}
