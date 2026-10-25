import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/shared/lib/useCarouselEndPull.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function harness(enabled = true) {
    const events = new Map();
    const list = { scrollLeft: 200, scrollWidth: 500, clientWidth: 300,
        addEventListener: (type, fn) => events.set(type, fn),
        removeEventListener: type => events.delete(type) };
    let progress = 0, opened = 0, pulses = 0, disposed = false, refIndex = 0, cleanup;
    const exports = {};
    let now = 0, nextFrame = 0;
    const frames = new Map();
    function advance(time) {
        now = time;
        const pending = [...frames.values()];
        frames.clear();
        pending.forEach(fn => fn(now));
    }
    new Function('require', 'exports', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance', 'window', js)(name => name === './haptic' ? {
        createHaptic: () => ({ pulse: () => { pulses++; }, dispose: () => { disposed = true; } })
    } : ({
        useRef: value => ({ current: refIndex++ === 0 ? list : value }),
        useState: () => [0, value => { progress = value; }],
        useEffect: effect => { cleanup = effect(); }
    }), exports, fn => { frames.set(++nextFrame, fn); return nextFrame; }, id => frames.delete(id),
    { now: () => now }, { matchMedia: () => ({ matches: false }) });
    exports.useCarouselEndPull(enabled, () => { opened++; });
    function fire(type, x = 100, y = 0, fingers = 1) {
        const event = { type, touches: Array.from({ length: fingers }, () => ({ clientX: x, clientY: y })),
            prevented: false, stopped: false,
            preventDefault() { this.prevented = true; }, stopPropagation() { this.stopped = true; } };
        events.get(type)?.(event);
        return event;
    }
    return { list, fire, events, cleanup, advance, progress: () => progress, opened: () => opened,
        pulses: () => pulses, disposed: () => disposed };
}
test('full pull pulses once before release, then opens and suppresses synthetic click', () => {
    const h = harness(); h.fire('touchstart');
    assert.equal(h.fire('touchmove', -44).prevented, true);
    assert.equal(h.progress(), 1); assert.equal(h.opened(), 0);
    assert.equal(h.pulses(), 1);
    h.fire('touchmove', -60);
    h.fire('touchmove', 50);
    h.fire('touchmove', -44);
    assert.equal(h.pulses(), 1);
    h.fire('touchend'); assert.equal(h.opened(), 1); assert.equal(h.progress(), 0);
    assert.equal(h.pulses(), 1);
    h.fire('touchend'); assert.equal(h.pulses(), 1);
    assert.equal(h.fire('click').stopped, true);
    h.cleanup(); assert.equal(h.events.size, 0); assert.equal(h.disposed(), true);
});
test('native carousel distance is not counted toward the end pull', () => {
    const h = harness(); h.list.scrollLeft = 0;
    h.fire('touchstart', 300); h.fire('touchmove', 100);
    assert.equal(h.progress(), 0);
    h.list.scrollLeft = 200; h.fire('touchmove', 50);
    h.fire('touchmove', 10); h.fire('touchend');
    assert.equal(h.opened(), 0);
});
test('reversal, vertical gestures, cancellation and multi-touch never open catalog', () => {
    for (const end of ['reverse', 'vertical', 'cancel', 'multitouch']) {
        const h = harness(); h.fire('touchstart');
        if (end === 'vertical') h.fire('touchmove', 90, 90);
        else {
            h.fire('touchmove', 20);
            if (end === 'reverse') { h.fire('touchmove', 110); assert.equal(h.progress(), 0); }
            if (end === 'multitouch') h.fire('touchmove', 10, 0, 2);
        }
        h.fire(end === 'cancel' ? 'touchcancel' : 'touchend');
        assert.equal(h.opened(), 0, end);
        assert.equal(h.pulses(), 0, end);
    }
    assert.equal(harness(false).events.size, 0);
});


test('incomplete pull returns gradually and a new gesture cancels the return frame', () => {
    const h = harness(); h.fire('touchstart'); h.fire('touchmove', 28);
    assert.equal(h.progress(), 0.5);
    h.fire('touchend'); assert.equal(h.progress(), 0.5);
    h.advance(130); assert.ok(h.progress() > 0 && h.progress() < 0.5);
    h.advance(260); assert.equal(h.progress(), 0); assert.equal(h.opened(), 0);
    h.fire('touchstart'); h.fire('touchmove', 28); h.fire('touchend');
    h.fire('touchstart'); h.fire('touchmove', -44); h.advance(520);
    assert.equal(h.progress(), 1);
    h.fire('touchend'); assert.equal(h.opened(), 1);
});


test('haptic threshold resets for the next touch gesture', () => {
    const h = harness();
    for (let i = 1; i <= 2; i++) {
        h.fire('touchstart'); h.fire('touchmove', -44);
        assert.equal(h.pulses(), i);
        h.fire('touchcancel');
        assert.equal(h.opened(), 0);
    }
});
