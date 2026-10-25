/** One same-URL browser entry protects the current mobile panel stack, including floor changes. */
export function createPanelHistory<T>(
    browser: Window, key: (value: T) => string, active: (value: T) => boolean,
    restore: (value: T) => void, backOverride?: (value: T, previous: T) => T | undefined,
    checkpoint?: (value: T, previous: T) => boolean
) {
    let path = browser.location.href;
    let stack: T[] = [];
    let armed = false;
    let removing = false;
    let restoring: string | null = null;
    const marker = '__navigatorPanels';
    function arm() {
        const state = browser.history.state ?? {};
        browser.history.pushState({ ...state, [marker]: { path, stack } }, '', path);
        armed = true;
    }
    function save() {
        browser.history.replaceState({ ...(browser.history.state ?? {}), [marker]: { path, stack } }, '', path);
    }
    function pop() {
        if (removing) {
            if (browser.location.href === path && browser.history.state?.[marker]?.path === path) {
                browser.history.back();
            } else removing = false;
            return;
        }
        if (browser.location.href !== path) {
            path = browser.location.href;
            const saved = browser.history.state?.[marker];
            stack = saved?.path === path && Array.isArray(saved.stack) ? saved.stack : [];
            armed = stack.length > 1;
            restoring = null;
            if (armed) {
                const current = stack[stack.length - 1];
                restoring = key(current);
                restore(current);
            }
            return;
        }
        if (!armed || stack.length < 2) return;
        const current = stack[stack.length - 1];
        const below = stack[stack.length - 2];
        if (checkpoint?.(current, below)) {
            stack.pop();
            const previous = stack[stack.length - 1];
            // One Back returns to the previous floor and drops the rest of that trail.
            let start = stack.length - 1;
            while (start > 0 && checkpoint?.(stack[start], stack[start - 1])) start--;
            if (start < stack.length - 1) stack = [...stack.slice(0, start), previous];
            armed = false;
            if (active(previous)) arm();
            restoring = key(previous);
            restore(previous);
            return;
        }
        const override = backOverride?.(stack[stack.length - 1], stack[stack.length - 2]);
        if (override) {
            armed = false; stack = [override]; restoring = key(override); restore(override);
            if (browser.history.state?.[marker]?.path === path) {
                removing = true;
                browser.history.back();
            }
            return;
        }
        armed = false;
        stack.pop();
        const previous = stack[stack.length - 1];
        if (active(previous)) arm();
        restoring = key(previous);
        restore(previous);
    }
    browser.addEventListener('popstate', pop);
    return {
        sync(value: T, base: T) {
            if (browser.location.href !== path) {
                path = browser.location.href;
                stack = [];
                armed = false;
                restoring = null;
            }
            if (removing) return;
            const valueKey = key(value);
            if (restoring !== null) {
                if (restoring === valueKey) restoring = null;
                return;
            }
            if (!active(value)) {
                stack = [value];
                if (armed) { armed = false; removing = true; browser.history.back(); }
                return;
            }
            if (!stack.length) stack.push(base);
            const index = stack.findIndex(item => key(item) === valueKey);
            if (index >= 0) stack = [...stack.slice(0, index), value];
            else stack.push(value);
            if (!armed) arm();
            else save();
        },
        dispose() {
            browser.removeEventListener('popstate', pop);
            if (armed && browser.location.href === path) browser.history.back();
        }
    };
}
