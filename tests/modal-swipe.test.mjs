import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/shared/lib/useModalSwipe.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup({ selected = false, scrolled = false, mobile = true, expanded } = {}) {
    const events = new Map(), cleanups = [];
    let stateIndex = 0, offset = 0, closed = 0, expands = 0, collapses = 0;
    const panel = {
        addEventListener: (name, fn) => events.set(name, fn),
        removeEventListener: name => events.delete(name)
    };
    class Element { closest() { return { scrollTop: scrolled ? 10 : 0 }; } }
    const exports = {};
    new Function('require', 'exports', 'window', 'Element', js)(() => ({
        useState: value => {
            const index = stateIndex++;
            return [index === 0 ? panel : value, next => { if (index === 1) offset = next; }];
        },
        useRef: value => ({ current: value }),
        useEffect: effect => { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); }
    }), exports, { getSelection: () => ({ isCollapsed: !selected }) }, Element);
    exports.useModalSwipe(true, mobile, () => { closed++; }, 'room', expanded === undefined ? undefined
        : { expanded, onExpand: () => { expands++; }, onCollapse: () => { collapses++; } });
    function fire(type, x, y) {
        const event = { type, target: new Element(), touches: [{ clientX: x, clientY: y }], preventDefault() {} };
        events.get(type)?.(event);
    }
    return { fire, events, offset: () => offset, closed: () => closed,
        expands: () => expands, collapses: () => collapses, dispose: () => cleanups.forEach(fn => fn()) };
}
test('full-surface downward swipe uses settings thresholds and cleans up', () => {
    const h = setup(); h.fire('touchstart', 100, 100); h.fire('touchmove', 100, 140);
    assert.equal(h.offset(), 40); h.fire('touchend', 100, 140); assert.equal(h.closed(), 1);
    h.dispose(); assert.equal(h.events.size, 0);
});
test('scrolling, text selection, horizontal gestures and desktop do not dismiss', () => {
    for (const config of [{ selected: true }, { scrolled: true }, { mobile: false }]) {
        const h = setup(config); h.fire('touchstart', 100, 100); h.fire('touchmove', 100, 180);
        h.fire('touchend', 100, 180); assert.equal(h.closed(), 0);
    }
    const h = setup(); h.fire('touchstart', 100, 100); h.fire('touchmove', 160, 110);
    h.fire('touchend', 160, 110); assert.equal(h.closed(), 0);
});
test('short and cancelled swipes reset without closing', () => {
    for (const cancel of [false, true]) {
        const h = setup(); h.fire('touchstart', 100, 100); h.fire('touchmove', 100, cancel ? 160 : 120);
        h.fire(cancel ? 'touchcancel' : 'touchend', 100, 160);
        assert.equal(h.closed(), 0); assert.equal(h.offset(), 0);
    }
});


test('preview expands upward and full details collapse downward without closing', () => {
    const preview = setup({ expanded: false });
    preview.fire('touchstart', 100, 100); preview.fire('touchmove', 100, 50); preview.fire('touchend', 100, 50);
    assert.equal(preview.expands(), 1); assert.equal(preview.closed(), 0);
    const full = setup({ expanded: true });
    full.fire('touchstart', 100, 100); full.fire('touchmove', 100, 150); full.fire('touchend', 100, 150);
    assert.equal(full.collapses(), 1); assert.equal(full.closed(), 0);
});
