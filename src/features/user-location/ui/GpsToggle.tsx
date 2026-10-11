import { LocateFixed } from 'lucide-react';
import { selectGps, setGps } from '@/entities/viewer';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { Button } from '@/shared/ui';

export function GpsToggle() {
    const dispatch = useAppDispatch()
    const gpsEnabled = useAppSelector(selectGps)

    return (
        <Button
            variant="outline"
            size="icon-lg"
            aria-label="GPS"
            aria-pressed={gpsEnabled}
            onClick={() => dispatch(setGps(!gpsEnabled))}
            className={cn(
                'size-11 bg-card shadow-subtle text-muted-foreground',
                gpsEnabled && 'border-primary text-primary hover:text-primary'
            )}
        >
            <LocateFixed className="size-5" />
        </Button>
    );
}
