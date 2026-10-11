import * as React from 'react';
import { cn } from '@/shared/lib/utils';

function Panel({
    className,
    elevated = false,
    ...props
}: React.ComponentProps<'div'> & { elevated?: boolean }) {
    return (
        <div
            data-slot="panel"
            className={cn(
                'rounded-xl border bg-card text-card-foreground',
                elevated && 'shadow-subtle',
                className
            )}
            {...props}
        />
    );
}

export { Panel };
