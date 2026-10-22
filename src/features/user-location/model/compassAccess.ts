type OrientationApi = typeof DeviceOrientationEvent & {
    requestPermission?: (absolute?: boolean) => Promise<'granted' | 'denied'>;
};
let granted = false;
const api = () => window.DeviceOrientationEvent as OrientationApi | undefined;
export const canUseCompass = () => window.isSecureContext && Boolean(api());
export const hasCompassAccess = () => canUseCompass() && (granted || !api()?.requestPermission);

/** Must be called directly from the GPS button's user activation on iOS. */
export async function requestCompassAccess(): Promise<boolean> {
    if (!canUseCompass()) return false;
    const orientation = api();
    if (!orientation?.requestPermission) return true;
    try {
        granted = await orientation.requestPermission(true) === 'granted';
        return granted;
    } catch { granted = false; return false; }
}
