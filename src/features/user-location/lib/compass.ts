export interface CompassSample {
    alpha: number | null;
    beta: number | null;
    gamma: number | null;
    absolute: boolean;
    webkitCompassHeading?: number;
    webkitCompassAccuracy?: number;
}

export const headingDelta = (angle: number) => ((angle + 180) % 360 + 360) % 360 - 180;
const normalized = (angle: number) => (angle % 360 + 360) % 360;

/** Project the screen top edge onto the ground; near vertical use the rear-facing normal. */
export function compassHeading(sample: CompassSample, screenAngle = 0): number | null {
    const webkit = sample.webkitCompassHeading;
    if (typeof webkit === 'number' && Number.isFinite(webkit) && webkit >= 0 && webkit <= 360) {
        if (sample.webkitCompassAccuracy !== undefined
            && (!Number.isFinite(sample.webkitCompassAccuracy)
                || sample.webkitCompassAccuracy < 0 || sample.webkitCompassAccuracy > 50)) return null;
        return normalized(webkit + screenAngle);
    }
    if (!sample.absolute || sample.alpha === null || !Number.isFinite(sample.alpha)) return null;
    const rad = Math.PI / 180;
    const a = sample.alpha * rad, b = (sample.beta ?? 0) * rad, g = (sample.gamma ?? 0) * rad;
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const cg = Math.cos(g), sg = Math.sin(g), s = Math.sin(screenAngle * rad), c = Math.cos(screenAngle * rad);
    let x = (ca * cg - sa * sb * sg) * s - sa * cb * c;
    let y = (sa * cg + ca * sb * sg) * s + ca * cb * c;
    if (Math.hypot(x, y) < 0.35 || cb < 0) {
        x = -ca * sg - sa * sb * cg;
        y = -sa * sg + ca * sb * cg;
    }
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.hypot(x, y) < 0.001) return null;
    return normalized(Math.atan2(x, y) / rad);
}
