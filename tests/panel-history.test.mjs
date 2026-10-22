import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/app/lib/panelHistory.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const exports = {};
new Function('exports', js)(exports);
function harness() {
    let index = 1, panel = 'base';
    const entries = [{ url: '/previous', state: {} }, { url: '/home', state: { idx: 1, key: 'router' } }];
    const listeners = new Set();
    const browser = {
        location: { get href() { return entries[index].url; } },
        history: {
            get state() { return entries[index].state; },
            pushState(state, _, url) {
                entries.splice(index + 1); entries.push({ state: structuredClone(state), url }); index++;
            },
            replaceState(state, _, url) { entries[index] = { state: structuredClone(state), url }; },
            back() { if (index > 0) { index--; [...listeners].forEach(fn => fn()); } }
        },
        addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn)
    };
    const controller = exports.createPanelHistory(browser, value => value, value => value !== 'base', value => {
        panel = value; controller.sync(value, 'base');
    });
    function sync(value) { panel = value; controller.sync(value, 'base'); }
    return { browser, controller, sync, panel: () => panel, count: () => entries.length };
}
test('Back restores nested panels before leaving the current page', () => {
    const h = harness(); h.sync('base'); h.sync('route'); h.sync('search'); h.sync('details');
    assert.equal(h.count(), 3); assert.equal(h.browser.history.state.idx, 1);
    for (const expected of ['search', 'route', 'base']) {
        h.browser.history.back(); assert.equal(h.panel(), expected); assert.equal(h.browser.location.href, '/home');
    }
    h.browser.history.back(); assert.equal(h.browser.location.href, '/previous');
});
test('manual close prunes layers and removes the extra entry at base', () => {
    const h = harness(); h.sync('base'); h.sync('search'); h.sync('settings'); h.sync('search');
    h.browser.history.back(); assert.equal(h.panel(), 'base');
    h.sync('campus'); h.sync('base');
    h.browser.history.back(); assert.equal(h.browser.location.href, '/previous');
});
test('returning to a route with an open panel restores its saved stack', () => {
    const h = harness(); h.sync('base'); h.sync('search'); h.sync('settings');
    h.browser.history.pushState({ idx: 2 }, '', '/building'); h.sync('base');
    h.browser.history.back(); assert.equal(h.browser.location.href, '/home'); assert.equal(h.panel(), 'settings');
    h.browser.history.back(); assert.equal(h.panel(), 'search');
});
test('plain pages do not trap Back and removing mobile handling drops the guard', () => {
    const h = harness(); h.sync('base'); h.browser.history.back();
    assert.equal(h.browser.location.href, '/previous');
    const mobile = harness(); mobile.sync('settings'); mobile.controller.dispose();
    mobile.browser.history.back(); assert.equal(mobile.browser.location.href, '/previous');
});
