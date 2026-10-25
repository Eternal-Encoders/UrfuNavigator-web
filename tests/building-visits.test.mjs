import test from 'node:test';
import { Buffer } from 'node:buffer';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/entities/building/lib/visitHistory.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { readBuildingVisits, recordBuildingVisit, createBuildingVisitTracker, BUILDING_VISITS_KEY }
    = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));

test('building visits count entries, not repeated searches or floor changes', () => {
    const visits = [];
    const enter = createBuildingVisitTracker(key => visits.push(key));
    enter('inmit-hti'); enter('inmit-hti'); // INMIT and HTI share a destination.
    enter(); enter('inmit-hti'); enter('uralenin'); enter('uralenin');
    assert.deepEqual(visits, ['inmit-hti', 'inmit-hti', 'uralenin']);
});
test('storage persists counts and rejects malformed or unsafe data', () => {
    const data = new Map();
    globalThis.localStorage = { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
    recordBuildingVisit('guk'); recordBuildingVisit('guk'); recordBuildingVisit('ugi');
    assert.deepEqual(readBuildingVisits(), { guk: 2, ugi: 1 });
    data.set(BUILDING_VISITS_KEY, '{'); assert.deepEqual(readBuildingVisits(), {});
    data.set(BUILDING_VISITS_KEY, JSON.stringify({ version: 1, counts: { guk: 3, bad: -1, fraction: 1.2,
        constructor: 2, '/url': 3 } }));
    assert.deepEqual(readBuildingVisits(), { guk: 3 });
    globalThis.localStorage = { getItem() { throw Error('disabled'); }, setItem() { throw Error('quota'); } };
    assert.deepEqual(readBuildingVisits(), {});
    assert.doesNotThrow(() => recordBuildingVisit('guk'));
    delete globalThis.localStorage;
});
