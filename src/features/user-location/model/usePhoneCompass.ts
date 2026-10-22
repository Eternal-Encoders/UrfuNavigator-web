import { useCallback, useEffect, useRef, useState } from 'react';
import { compassHeading, headingDelta, type CompassSample } from '../lib/compass';
import { hasCompassAccess, requestCompassAccess } from './compassAccess';

export function usePhoneCompass(enabled: boolean) {
    const needleRef = useRef<SVGSVGElement>(null);
    const [allowed, setAllowed] = useState(hasCompassAccess);
    const [ready, setReady] = useState(false);
    const requestAccess = useCallback(async () => { setAllowed(await requestCompassAccess()); }, []);
    useEffect(() => {
        if (!enabled || !allowed) return;
        let frame = 0, lastTime = 0;
        let reported = false;
        let current: number | null = null, target: number | null = null;
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        function draw(now: number) {
            if (current === null || target === null) { frame = 0; return; }
            const dt = lastTime ? Math.min(100, now - lastTime) : 16;
            lastTime = now;
            current += (target - current) * (reduced ? 1 : 1 - Math.exp(-dt / 100));
            needleRef.current?.style.setProperty('--phone-compass-heading', `${current}deg`);
            frame = Math.abs(target - current) > 0.05 ? requestAnimationFrame(draw) : 0;
        }
        function receive(event: DeviceOrientationEvent) {
            if (document.hidden) return;
            const screenAngle = screen.orientation?.angle ?? Number(window.orientation ?? 0);
            const heading = compassHeading(event as CompassSample, screenAngle);
            if (heading === null) {
                const absoluteSource = event.absolute || 'webkitCompassHeading' in event;
                if (absoluteSource) visibility();
                return;
            }
            if (current === null) current = heading;
            target = current + headingDelta(heading - current);
            if (!reported) { reported = true; setReady(true); }
            if (!frame) { lastTime = 0; frame = requestAnimationFrame(draw); }
        }
        function visibility() {
            cancelAnimationFrame(frame); frame = 0; current = null; target = null; reported = false; setReady(false);
        }
        window.addEventListener('deviceorientationabsolute', receive);
        window.addEventListener('deviceorientation', receive);
        document.addEventListener('visibilitychange', visibility);
        return () => {
            setReady(false);
            cancelAnimationFrame(frame);
            window.removeEventListener('deviceorientationabsolute', receive);
            window.removeEventListener('deviceorientation', receive);
            document.removeEventListener('visibilitychange', visibility);
        };
    }, [enabled, allowed]);
    return { needleRef, ready: enabled && allowed && ready, requestAccess };
}
