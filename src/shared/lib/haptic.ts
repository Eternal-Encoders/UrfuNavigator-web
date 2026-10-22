/** Optional feedback only: browser refusal must never interrupt the category gesture. */
export function createHaptic() {
    let control: HTMLInputElement | null = null;
    function switchPulse() {
        if (!control) {
            const input = document.createElement('input');
            if (!('switch' in input)) return;
            input.type = 'checkbox';
            input.setAttribute('switch', '');
            input.tabIndex = -1;
            input.setAttribute('aria-hidden', 'true');
            input.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0;';
            document.body.append(input);
            control = input;
        }
        // Safari may allow a native switch click during the trusted touchend activation.
        control.click();
    }
    return {
        pulse(event: Event) {
            if (!event.isTrusted || document.visibilityState !== 'visible') return;
            try {
                // Vibration requires sticky activation; do not gate it on transient isActive.
                if (typeof navigator.vibrate === 'function' && navigator.vibrate(30)) return;
                if (navigator.userActivation && !navigator.userActivation.isActive) return;
                switchPulse();
            } catch {
                // Unsupported devices, browser policy or system settings can suppress feedback.
            }
        },
        dispose() { control?.remove(); control = null; }
    };
}
