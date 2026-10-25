import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/shared/lib/haptic.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function setup({ vibration, supported = true, active = true, visible = true } = {}) {
    let clicks = 0, appended = 0, removed = 0;
    const control = { ...(supported ? { switch: false } : {}), style: {}, setAttribute() {},
        click() { clicks++; }, remove() { removed++; } };
    const document = { visibilityState: visible ? 'visible' : 'hidden', createElement: () => control,
        body: { append: () => { appended++; } } };
    const navigator = { userActivation: { isActive: active }, vibrate: vibration };
    const exports = {};
    new Function('exports', 'document', 'navigator', js)(exports, document, navigator);
    return { haptic: exports.createHaptic(), counts: () => ({ clicks, appended, removed }) };
}
test('native vibration takes precedence and does not create a switch', () => {
    const durations = [];
    const h = setup({ vibration: ms => { durations.push(ms); return true; } });
    h.haptic.pulse({ isTrusted: true });
    assert.deepEqual(durations, [30]); assert.equal(h.counts().appended, 0);
});
test('switch fallback is reused and removed on cleanup', () => {
    const h = setup(); h.haptic.pulse({ isTrusted: true }); h.haptic.pulse({ isTrusted: true });
    assert.deepEqual(h.counts(), { appended: 1, clicks: 2, removed: 0 });
    h.haptic.dispose(); assert.equal(h.counts().removed, 1);
});
test('synthetic, inactive, hidden or unsupported cases are silent; failures do not throw', () => {
    for (const config of [{ active: false }, { visible: false }, { supported: false }]) {
        const h = setup(config); h.haptic.pulse({ isTrusted: true }); assert.equal(h.counts().clicks, 0);
    }
    const h = setup(); h.haptic.pulse({ isTrusted: false }); assert.equal(h.counts().clicks, 0);
    assert.doesNotThrow(() => setup({ vibration: () => { throw new Error('blocked'); } }).haptic.pulse({ isTrusted: true }));
});


test('native vibration is attempted after transient activation expires', () => {
    const durations = [];
    const h = setup({ active: false, vibration: ms => { durations.push(ms); return true; } });
    h.haptic.pulse({ isTrusted: true });
    assert.deepEqual(durations, [30]); assert.equal(h.counts().appended, 0);
});
