import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { Buffer } from 'node:buffer';
let sequence = 0;
async function load(path) {
    const source = await readFile(new URL('../src/' + path, import.meta.url), 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
    return import('data:text/javascript;base64,' + Buffer.from(code + `\n//${++sequence}`).toString('base64'));
}
const { compassHeading, headingDelta } = await load('features/user-location/lib/compass.ts');
const { mapNorth } = await load('widgets/floor-map/lib/north.ts');
const flat = { alpha: 0, beta: 0, gamma: 0, absolute: true };
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-5, `${a} != ${b}`);

test('absolute compass follows north/east/west and screen rotation', () => {
    near(compassHeading(flat), 0);
    near(compassHeading({ ...flat, alpha: 90 }), 270);
    near(compassHeading({ ...flat, alpha: 270 }), 90);
    near(compassHeading(flat, 90), 90);
    near(compassHeading({ ...flat, alpha: 270, beta: 90 }), 90);
});
test('relative orientation and invalid readings never masquerade as a compass', () => {
    assert.equal(compassHeading({ ...flat, absolute: false }), null);
    assert.equal(compassHeading({ ...flat, alpha: null }), null);
    assert.equal(compassHeading({ ...flat, alpha: NaN }), null);
    assert.equal(compassHeading({ ...flat, beta: Infinity }), null);
});
test('webkit heading works without absolute alpha but invalid accuracy is rejected', () => {
    const sample = { ...flat, alpha: null, absolute: false,
        webkitCompassHeading: 350, webkitCompassAccuracy: 10 };
    near(compassHeading(sample, 90), 80);
    assert.equal(compassHeading({ ...sample, webkitCompassAccuracy: -1 }), null);
    assert.equal(compassHeading({ ...sample, webkitCompassAccuracy: 90 }), null);
    assert.equal(compassHeading({ ...sample, webkitCompassHeading: -1 }), null);
});
test('smoothing crosses north by the short path', () => {
    assert.equal(headingDelta(1 - 359), 2);
    assert.equal(headingDelta(359 - 1), -2);
});
test('true north derives from calibrated floor coordinates, not the phone movement heading', () => {
    near(mapNorth(loc => ({ x: loc.longitude, y: -loc.latitude }), 56, 60, 100), 0);
    near(mapNorth(loc => ({ x: loc.latitude, y: loc.longitude }), 56, 60, 100), 90);
    assert.equal(mapNorth(null, 56, 60, 100), null);
    assert.equal(mapNorth(() => ({ x: 0, y: 0 }), 56, 60, 100), null);
});
test('permission is requested only through explicit API call and is not requested on insecure HTTP', async () => {
    const original = globalThis.window; let requests = 0;
    try {
        globalThis.window = { isSecureContext: false,
            DeviceOrientationEvent: { requestPermission: () => { requests++; } } };
        let access = await load('features/user-location/model/compassAccess.ts');
        assert.equal(await access.requestCompassAccess(), false); assert.equal(requests, 0);
        globalThis.window = { isSecureContext: true, DeviceOrientationEvent: {
            requestPermission: async absolute => { assert.equal(absolute, true); requests++; return 'granted'; }
        } };
        access = await load('features/user-location/model/compassAccess.ts');
        assert.equal(access.hasCompassAccess(), false); assert.equal(requests, 0);
        assert.equal(await access.requestCompassAccess(), true); assert.equal(requests, 1);
        assert.equal(access.hasCompassAccess(), true);
        window.DeviceOrientationEvent.requestPermission = async () => 'denied';
        assert.equal(await access.requestCompassAccess(), false); assert.equal(access.hasCompassAccess(), false);
        window.DeviceOrientationEvent.requestPermission = async () => { throw new Error('blocked'); };
        assert.equal(await access.requestCompassAccess(), false);
    } finally { globalThis.window = original; }
});
