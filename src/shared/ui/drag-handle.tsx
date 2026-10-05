import * as React from 'react';
import { cn } from '@/shared/lib/utils';

function DragHandle({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="drag-handle"
            aria-hidden
            className={cn('mb-2.5 flex w-full items-center justify-center desktop:mb-0', className)}
            {...props}
        >
            <span className="block h-1.5 w-12.5 rounded-full bg-subtle-foreground" />
        </div>
    );
}

export { DragHandle };
