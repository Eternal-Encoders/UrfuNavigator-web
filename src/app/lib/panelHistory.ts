/** One same-URL browser entry protects the current mobile panel stack. */
export function createPanelHistory<T>(
    browser: Window, key: (value: T) => string, active: (value: T) => boolean,
    restore: (value: T) => void
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
        if (removing) { removing = false; return; }
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
