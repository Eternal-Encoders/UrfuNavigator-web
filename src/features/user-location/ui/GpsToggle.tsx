import { LocateFixed } from 'lucide-react';
import { selectGps, setGps } from '@/entities/viewer';
import { cn, useAppDispatch, useAppSelector } from '@/shared/lib';
import { usePhoneCompass } from '../model/usePhoneCompass';
import { CompassNeedle } from './CompassNeedle';
import { Button } from '@/shared/ui';

export function GpsToggle() {
    const dispatch = useAppDispatch()
    const gpsEnabled = useAppSelector(selectGps)

    const { needleRef, ready, requestAccess } = usePhoneCompass(gpsEnabled);

    return (
        <div className="relative">
            <CompassNeedle needleRef={needleRef} ready={ready} />
            <Button
                variant="ghost"
                size="icon-lg"
                aria-label="GPS"
                aria-pressed={gpsEnabled}
                onClick={() => {
                    if (!gpsEnabled) void requestAccess();
                    dispatch(setGps(!gpsEnabled));
                }}
                className={cn(
                    'size-10 border-0 bg-card shadow-subtle text-muted-foreground',
                    gpsEnabled && 'text-primary hover:text-primary'
                )}
            >
                <LocateFixed className="size-5" />
            </Button>
        </div>
    );
}
