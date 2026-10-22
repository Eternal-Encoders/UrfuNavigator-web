import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createSlice } from '@reduxjs/toolkit';

async function moduleFactory(path, bindings, result) {
    const source = await readFile(new URL('../src/' + path, import.meta.url), 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
    const exports = {};
    new Function('require', 'exports', js)(name => {
        if (!(name in bindings)) throw new Error(`Unexpected import ${name}`);
        return bindings[name];
    }, exports);
    return exports[result];
}
const search = await moduleFactory('features/point-search/model/pointSearchSlice.ts', {
    '@reduxjs/toolkit': { createSlice }, '../lib/searchHistoryStorage': { readSearchHistory: () => [] }
}, 'pointSearchSlice');
const action = type => payload => ({ type, payload });
const sidebar = { Empty: 'empty', TypeList: 'typeList', PointsList: 'pointsList', Route: 'route' };

for (const target of ['browse', 'from', 'to']) {
    test(`search selection isolates ${target} from other route operations`, async () => {
        let state = search.reducer(undefined, { type: 'init' });
        state = search.reducer(state, search.actions.setSearchDirection(target));
        state = search.reducer(state, search.actions.setSearchName('123'));
        assert.equal(state[target].name, '123');
        const calls = [];
        let route = { from: { id: 'oldFrom' }, to: { id: 'oldTo' } };
        const dispatch = a => {
            calls.push(a);
            if (a.type === 'clear') route = {};
            if (a.type === 'from' || a.type === 'to') route[a.type] = a.payload;
            state = search.reducer(state, a);
        };
        const useSelectPoint = await moduleFactory('features/point-search/model/useSelectPoint.ts', {
            'react-router-dom': { useNavigate: () => action('navigate') },
            '@/entities/building': { useGetBuildingsQuery: () => ({ data: [] }), instituteRoute: () => '' },
            '@/entities/floor': { floorSet: action('floor') },
            '@/entities/point': { selectPoint: action('selected') },
            '@/entities/route': { clearRoute: action('clear'), setFromPoint: action('from'), setToPoint: action('to') },
            '@/entities/sidebar': { SideBarContent: sidebar, selectContent: () => 'pointsList', selectPrevContent: () => 'route', setContent: action('content') },
            '@/shared/lib': { useAppDispatch: () => dispatch, useAppSelector: selector => selector() },
            './pointSearchSlice': { ...search.actions, selectSearchDirection: () => target }
        }, 'useSelectPoint');
        const point = { id: 'new', floorId: 'floor1' };
        useSelectPoint()(point);
        if (target === 'browse') {
            assert.deepEqual(route, {});
            assert.ok(calls.some(a => a.type === 'selected' && a.payload === 'new'));
            assert.equal(calls.find(a => a.type === 'content').payload, 'empty');
        } else {
            assert.equal(route[target], point);
            assert.equal(route[target === 'from' ? 'to' : 'from'].id, target === 'from' ? 'oldTo' : 'oldFrom');
            assert.ok(!calls.some(a => a.type === 'clear' || a.type === 'selected'));
            assert.equal(calls.find(a => a.type === 'content').payload, 'route');
        }
        assert.equal(state[target].name, '');
        assert.equal(state.recentPoints[0].id, 'new');
    });
}


test('all category searches use type-only listing and page without duplicates', async () => {
    const api = await moduleFactory('entities/point/api/pointApi.ts', {
        '@/shared/api': { baseApi: { injectEndpoints: ({ endpoints }) => endpoints({ query: definition => definition }) } }
    }, 'pointApi');
    for (const type of ['toilet-m', 'toilet-w', 'cafe', 'any-category']) {
        const args = { name: 'Localized category label', type, buildingId: 'building', floorId: 'floor', length: 40, offset: 40 };
        const request = api.searchPoints.query(args);
        assert.equal(request.url, '/api/points');
        assert.deepEqual(request.params, { type, buildingId: 'building', floorId: 'floor', length: 80 });
        const points = Array.from({ length: 65 }, (_, id) => ({ id }));
        assert.deepEqual(api.searchPoints.transformResponse(points, undefined, args), points.slice(40));
    }
    const request = api.searchPoints.query({ name: 'P-123', offset: 0, length: 40 });
    assert.equal(request.url, '/api/search');
    assert.equal(request.params.name, 'P-123');
});


test('campus modal opens and closes without replacing underlying panel content', async () => {
    const slice = await moduleFactory('entities/sidebar/model/sidebarSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'sidebarSlice');
    let state = slice.reducer(undefined, { type: 'init' });
    const initial = { content: state.content, prevContent: state.prevContent };
    state = slice.reducer(state, slice.actions.setCampusOpen(true));
    assert.equal(state.campusOpen, true);
    assert.deepEqual({ content: state.content, prevContent: state.prevContent }, initial);
    state = slice.reducer(state, slice.actions.setCampusOpen(false));
    assert.equal(state.campusOpen, false);
    assert.deepEqual({ content: state.content, prevContent: state.prevContent }, initial);
});
