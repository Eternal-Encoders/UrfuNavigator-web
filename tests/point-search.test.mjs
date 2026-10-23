import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { createSlice } from '@reduxjs/toolkit';

async function moduleFactory(path, bindings, result) {
    const source = await readFile(new URL('../src/' + path, import.meta.url), 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: {
        module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX
    } }).outputText;
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
            'react-router-dom': { useNavigate: () => action('navigate'), useLocation: () => ({ pathname: '/' }) },
            '@/entities/building': { useGetBuildingsQuery: () => ({ data: [] }), instituteRoute: () => '' },
            '@/entities/floor': { floorSet: action('floor'), selectFloor: () => 'floor1' },
            '@/entities/point': { focusPoint: action('focus') },
            '@/entities/route': { clearRoute: action('clear'), setFromPoint: action('from'), setToPoint: action('to') },
            '@/entities/sidebar': { SideBarContent: sidebar, selectContent: () => 'pointsList', selectPrevContent: () => 'route', setContent: action('content'), setRouteOpen: action('routeOpen') },
            '@/shared/lib': { useAppDispatch: () => dispatch, useAppSelector: selector => selector() },
            './pointSearchSlice': { ...search.actions, selectSearchDirection: () => target },
            './fillRouteEntrance': { fillRouteEntrance: action('entrance') }
        }, 'useSelectPoint');
        const point = { id: 'new', floorId: 'floor1' };
        useSelectPoint()(point);
        if (target === 'browse') {
            assert.deepEqual(route, {});
            assert.ok(calls.some(a => a.type === 'focus' && a.payload.point.id === 'new' && a.payload.animate));
            assert.equal(calls.find(a => a.type === 'content').payload, 'empty');
        } else {
            assert.equal(route[target], point);
            assert.equal(route[target === 'from' ? 'to' : 'from'].id, target === 'from' ? 'oldTo' : 'oldFrom');
            assert.ok(!calls.some(a => a.type === 'clear' || a.type === 'focus'));
            assert.equal(calls.find(a => a.type === 'content').payload, 'route');
        }
        assert.equal(state[target].name, '');
        assert.equal(state.recentPoints[0].id, 'new');
        assert.ok(!calls.some(a => a.type === 'entrance'));
        if (target !== 'browse') {
            calls.length = 0;
            useSelectPoint()(point, target);
            assert.ok(calls.some(a => a.type === target && a.payload === point));
            assert.ok(calls.some(a => a.type === 'routeOpen' && a.payload === true));
            assert.ok(!calls.some(a => a.type === 'clear'));
        }
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


test('map focus opens a collapsed preview and clears highlight on dismissal', async () => {
    const slice = await moduleFactory('entities/point/model/selectedPointSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'selectedPointSlice');
    const point = { id: 'room', x: 200, y: 300, floorId: 'floor' };
    let state = slice.reducer(undefined, slice.actions.focusPoint({ point, animate: true }));
    assert.equal(state.pointId, 'room'); assert.equal(state.detailsCollapsed, true);
    assert.equal(state.focus.id, 'room'); assert.equal(state.focusAnimate, true);
    const version = state.focusVersion;
    state = slice.reducer(state, slice.actions.focusPoint({ point, animate: false }));
    assert.equal(state.focusVersion, version + 1); assert.equal(state.focusAnimate, false);
    state = slice.reducer(state, slice.actions.setDetailsCollapsed(false));
    assert.equal(state.detailsCollapsed, false); assert.equal(state.focus.id, 'room');
    state = slice.reducer(state, slice.actions.focusPoint({ point, animate: true }));
    assert.equal(state.detailsCollapsed, true);
    assert.equal(state.previewEnabled, true);
    assert.equal(state.focusVersion, version + 2);
    state = slice.reducer(state, slice.actions.clearSelectedPoint());
    assert.equal(state.pointId, undefined); assert.equal(state.focus, undefined);
});


test('room preview is search-only and its origin survives history restoration', async () => {
    const slice = await moduleFactory('entities/point/model/selectedPointSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'selectedPointSlice');
    const reduce = (state, action) => slice.reducer(state, action);
    let state = reduce(undefined, slice.actions.focusPoint({ point: { id: 'room' }, animate: true }));
    assert.equal(state.previewEnabled, true);
    state = reduce(state, slice.actions.selectPoint('room'));
    assert.equal(state.previewEnabled, false);
    state = reduce(state, slice.actions.setDetailsCollapsed(true));
    assert.equal(state.detailsCollapsed, false);
    state = reduce(state, slice.actions.restorePointDetails({ pointId: 'room', previewEnabled: true, detailsCollapsed: true }));
    assert.equal(state.previewEnabled, true);
    assert.equal(state.detailsCollapsed, true);
    state = reduce(state, slice.actions.restorePointDetails({ pointId: 'room', previewEnabled: false, detailsCollapsed: true }));
    assert.equal(state.detailsCollapsed, false);
    state = reduce(state, slice.actions.clearSelectedPoint());
    assert.equal(state.previewEnabled, false);
});


test('initial floor anchor uses only explicit valid entrances on floor one', async () => {
    const anchor = await moduleFactory('widgets/floor-map/lib/initialView.ts', {
        '@/shared/api': { PointTypes: { Exit: 'exit' } }
    }, 'initialMapAnchor');
    const entrance = { id: 'a', x: 100, y: 200, types: ['exit'], names: [], displayableName: 'Entrance' };
    const main = { ...entrance, id: 'b', x: 300, displayableName: 'Главный вход' };
    assert.deepEqual(anchor(1000, 800, false, [entrance]), { x: 500, y: 400 });
    assert.deepEqual(anchor(1000, 800, true), { x: 500, y: 400 });
    assert.deepEqual(anchor(1000, 800, false, [], { x: 900, y: 300 }), { x: 900, y: 300 });
    assert.deepEqual(anchor(1000, 800, true, [entrance], { x: 900, y: 300 }), { x: 100, y: 200 });
    assert.deepEqual(anchor(1000, 800, true, [entrance, main]), { x: 300, y: 200 });
    assert.deepEqual(anchor(1000, 800, true, [{ ...entrance, x: NaN }, { ...main, y: 900 }]),
        { x: 500, y: 400 });
    assert.deepEqual(anchor(1000, 800, true, [{ ...entrance, types: ['auditorium'] }]), { x: 500, y: 400 });
});


test('campus selection supports refocusing and rejects unavailable campus', async () => {
    const slice = await moduleFactory('entities/campus/model/campusSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'campusSlice');
    let state = slice.reducer(undefined, { type: 'init' });
    assert.equal(state.selected, 'mira');
    state = slice.reducer(state, slice.actions.selectCampus('lenina'));
    assert.equal(state.selected, 'lenina'); assert.equal(state.version, 1);
    state = slice.reducer(state, slice.actions.selectCampus('novokoltsovsky'));
    assert.equal(state.selected, 'lenina'); assert.equal(state.version, 1);
    state = slice.reducer(state, slice.actions.selectCampus('lenina'));
    assert.equal(state.version, 2);
    state = slice.reducer(state, slice.actions.selectCampus('mira'));
    assert.equal(state.selected, 'mira');
});


test('route overlay and endpoint search preserve underlying institute panel', async () => {
    const slice = await moduleFactory('entities/sidebar/model/sidebarSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'sidebarSlice');
    let state = slice.reducer(undefined, { type: 'init' });
    const content = state.content;
    state = slice.reducer(state, slice.actions.setContent('route'));
    assert.equal(state.routeOpen, true); assert.equal(state.content, content);
    state = slice.reducer(state, slice.actions.setContent('typeList'));
    assert.equal(state.routeContent, 'typeList'); assert.equal(state.content, content);
    state = slice.reducer(state, slice.actions.setContentNoHistory('pointsList'));
    assert.equal(state.routeContent, 'pointsList'); assert.equal(state.content, content);
    state = slice.reducer(state, slice.actions.setContent('route'));
    assert.equal(state.routeContent, 'route'); assert.equal(state.routeOpen, true);
    state = slice.reducer(state, slice.actions.setRouteOpen(false));
    assert.equal(state.routeOpen, false); assert.equal(state.content, content);
    state = slice.reducer(state, slice.actions.restorePanel({ content, prevContent: 'empty',
        settingsOpen: false, campusOpen: false, routeOpen: true, routeContent: 'typeList', restingHeight: 244 }));
    assert.equal(state.routeOpen, true); assert.equal(state.routeContent, 'typeList');
    state = slice.reducer(state, slice.actions.setMainContent('empty'));
    assert.equal(state.content, 'empty'); assert.equal(state.routeContent, 'typeList');
});


for (const scenario of ['browse', 'route', 'unrelated']) {
    test(`building initialization preserves search floor: ${scenario}`, async () => {
        const calls = [];
        const building = { id: 'b', floors: [{ id: 'first', displayableName: '1' },
            { id: 'third', displayableName: '3' }] };
        const point = { buildingId: scenario === 'unrelated' ? 'other' : 'b', floorId: 'third' };
        const init = await moduleFactory('pages/institute/model/useInstituteBuilding.ts', {
            '@reduxjs/toolkit/query': { skipToken: Symbol() },
            react: { useEffect: fn => fn(), useRef: value => ({ current: value }),
                useState: value => [value, () => {}] },
            '@/entities/building': { matchBuilding: () => building, defaultFloor: floors => floors[0],
                useGetBuildingQuery: () => ({}), useGetBuildingsQuery: () => ({ data: [building] }) },
            '@/entities/floor': { floorSet: action('floor'), floorReset: action('reset') },
            '@/entities/route': { selectRoutePoints: () => scenario === 'route' ? { to: point } : {} },
            '@/entities/point': { selectPointPresentation: () => ({ focus: scenario === 'route' ? undefined : point }) },
            '@/features/user-location': { useUserLocation: () => ({}) },
            '@/shared/api': { apiErrorText: () => undefined }, '@/shared/config': { GPS_BUFFER: 0 },
            '@/shared/lib': { useAppDispatch: () => value => calls.push(value),
                useAppSelector: selector => selector(), approxGps: () => undefined }
        }, 'useInstituteBuilding');
        init('building');
        if (scenario === 'unrelated') {
            assert.ok(calls.some(call => call.type === 'reset' && call.payload === 'first'));
        } else {
            assert.ok(calls.some(call => call.type === 'floor' && call.payload.floor === 'third'));
            assert.ok(!calls.some(call => call.type === 'reset'));
        }
    });
}


test('default route entrance respects manual edits and rejects stale fetch results', async () => {
    const slice = await moduleFactory('entities/route/model/routeSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'routeSlice');
    const destination = { id: 'room' }, entrance = { id: 'entrance' };
    let state = slice.reducer(undefined, slice.actions.setToPoint(destination));
    const revision = state.revision;
    state = slice.reducer(state, slice.actions.setDefaultFromPoint({ point: entrance, destinationId: 'room', revision }));
    assert.equal(state.from.id, 'entrance');
    state = slice.reducer(state, slice.actions.setFromPoint({ id: 'manual' }));
    state = slice.reducer(state, slice.actions.setDefaultFromPoint({ point: entrance, destinationId: 'room', revision }));
    assert.equal(state.from.id, 'manual');
    state = slice.reducer(state, slice.actions.clearRoute());
    state = slice.reducer(state, slice.actions.setToPoint(destination));
    state = slice.reducer(state, slice.actions.setDefaultFromPoint({ point: entrance, destinationId: 'room', revision }));
    assert.equal(state.from, undefined);
});

test('route entrance uses an explicit first-floor entrance and prefers main entrance', async () => {
    const choose = await moduleFactory('features/point-search/model/fillRouteEntrance.ts', {
        '@/entities/point': {}, '@/entities/route': {}, '@/shared/api': { PointTypes: { Exit: 'exit' } }
    }, 'chooseRouteEntrance');
    const point = { id: 'a', buildingId: 'b', floorId: 'first', types: ['exit'], x: 100, y: 100,
        names: [], displayableName: 'Вход' };
    const main = { ...point, id: 'z', displayableName: 'Главный вход' };
    assert.equal(choose([point, main], 'b', 'first').id, 'z');
    assert.equal(choose([{ ...main, floorId: 'third' }], 'b', 'first'), undefined);
    assert.equal(choose([{ ...point, buildingId: 'other' }], 'b', 'first'), undefined);
    assert.equal(choose([], 'b', 'first'), undefined);
});


test('entrance lookup requests source-building floor one and skips a manual origin', async () => {
    const calls = [];
    const entrance = { id: 'entry', buildingId: 'source', floorId: 'floor1', types: ['exit'],
        x: 10, y: 20, names: [], displayableName: 'Вход' };
    const fill = await moduleFactory('features/point-search/model/fillRouteEntrance.ts', {
        '@/entities/point': { pointApi: { endpoints: { getPoints: {
            initiate: args => ({ type: 'fetch', args }) } } } },
        '@/entities/route': { selectRoutePoints: state => state, setDefaultFromPoint: action('autoFrom') },
        '@/shared/api': { PointTypes: { Exit: 'exit' } }
    }, 'fillRouteEntrance');
    const dispatch = value => {
        calls.push(value);
        return { unwrap: async () => [entrance] };
    };
    const building = { id: 'source', floors: [{ id: 'floor1', displayableName: '1' }] };
    await fill(building, 'room')(dispatch, () => ({ to: { id: 'room' }, revision: 3 }));
    assert.deepEqual(calls[0].args, { buildingId: 'source', floorId: 'floor1', type: 'exit', length: 100 });
    assert.equal(calls[1].payload.point, entrance);
    assert.equal(calls[1].payload.revision, 3);
    calls.length = 0;
    await fill(building, 'room')(dispatch, () => ({ from: { id: 'manual' }, to: { id: 'room' }, revision: 4 }));
    assert.equal(calls.length, 0);
});


test('completed route edits endpoints inside the main panel', async () => {
    const slice = await moduleFactory('entities/sidebar/model/sidebarSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'sidebarSlice');
    let state = slice.reducer(undefined, slice.actions.setRouteOpen(true));
    const base = state.content;
    state = slice.reducer(state, slice.actions.setRouteDocked(true));
    assert.equal(state.routeOpen, false); assert.equal(state.routeDocked, true);
    assert.equal(slice.getSelectors().selectMainContent(state), 'route');
    assert.equal(state.content, base);
    state = slice.reducer(state, slice.actions.setContent('typeList'));
    assert.equal(state.routeOpen, false); assert.equal(state.routeContent, 'typeList');
    assert.equal(slice.getSelectors().selectContent(state), 'typeList');
    state = slice.reducer(state, slice.actions.setContentNoHistory('pointsList'));
    assert.equal(state.routeOpen, false); assert.equal(state.routeContent, 'pointsList');
    state = slice.reducer(state, slice.actions.finishRouteSearch());
    assert.equal(state.routeContent, 'route');
    state = slice.reducer(state, slice.actions.setRouteDocked(false));
    state = slice.reducer(state, slice.actions.setRouteOpen(false));
    assert.equal(slice.getSelectors().selectMainContent(state), base);
});


for (const [name, points, panel, expected] of [
    ['complete', { from: {}, to: {} }, { routeDocked: false, routeOpen: true, routeContent: 'route' }, ['dock:true']],
    ['editing', { from: {}, to: {} }, { routeDocked: true, routeOpen: true, routeContent: 'pointsList' }, []],
    ['origin filled', { from: { id: 'entry' } },
        { routeDocked: false, routeOpen: true, routeContent: 'route' }, ['direction:to', 'content:typeList']],
    ['origin filled during search', { from: { id: 'entry' } },
        { routeDocked: false, routeOpen: true, routeContent: 'pointsList' }, ['direction:to', 'content:typeList']],
    ['cleared', {}, { routeDocked: true, routeOpen: false, routeContent: 'route' }, ['dock:false', 'open:false']]
]) {
    test(`route presentation coordinates ${name}`, async () => {
        const calls = [];
        const hook = await moduleFactory('app/model/useRoutePresentation.ts', {
            react: { useEffect: fn => fn(), useRef: value => ({ current: value }) },
            '@/features/point-search': { setSearchDirection: value => `direction:${value}` },
            '@/entities/route': { selectRoutePoints: () => points },
            '@/entities/sidebar': { selectPanelState: () => panel, SideBarContent: { Route: 'route', TypeList: 'typeList', PointsList: 'pointsList' },
                setContent: value => `content:${value}`, setRouteDocked: value => `dock:${value}`, setRouteOpen: value => `open:${value}` },
            '@/shared/lib': { useAppDispatch: () => value => calls.push(value),
                useAppSelector: selector => selector() }
        }, 'useRoutePresentation');
        hook(); assert.deepEqual(calls, expected);
    });
}


test('route categories cannot expand and preserve route search direction', async () => {
    const calls = [], pulls = [];
    const types = { ToiletM: 'toilet-m', ToiletW: 'toilet-w', Dinning: 'dinning',
        Coworking: 'coworking', Cafe: 'cafe', Print: 'print' };
    const QuickTypes = await moduleFactory('features/point-search/ui/QuickTypes.tsx', {
        'react/jsx-runtime': await import('react/jsx-runtime'),
        react: { useState: value => [value, () => {}] }, 'react-i18next': { useTranslation: () => ({ t: key => key }) },
        '@/entities/point': { clearSelectedPoint: action('clearPoint'),
            QUICK_POINT_TYPES: Object.values(types).map(tipType => ({ tipType, title: tipType, tipIcon: 'icon' })) },
        '@/entities/route': { clearRoute: action('clearRoute') },
        '@/entities/sidebar': { SideBarContent: { ...sidebar, Categories: 'categories' },
            selectContent: () => 'typeList', setContentNoHistory: action('content') },
        '@/entities/viewer': { selectScreenSize: () => ({ innerWidth: 390 }) },
        '@/shared/config': { PHONE_BREAKPOINT: 1200 }, '@/shared/api': { PointTypes: types },
        '@/shared/lib': { useAppDispatch: () => value => calls.push(value), useAppSelector: selector => selector(),
            useCarouselEndPull: enabled => { pulls.push(enabled); return { listRef: {}, progress: 0 }; } },
        '../model/pointSearchSlice': { setSearchDirection: action('direction'), setSearchType: action('type') }
    }, 'QuickTypes');
    const tree = QuickTypes({ expandable: false });
    const rows = tree.props.children.flat().filter(Boolean);
    assert.equal(rows.length, 6); assert.deepEqual(pulls, [false]);
    assert.ok(rows.every(row => row.props.children.props.className === 'category-card'));
    rows[0].props.children.props.onClick();
    assert.ok(calls.some(call => call.type === 'type'));
    assert.ok(!calls.some(call => ['clearRoute', 'clearPoint', 'direction'].includes(call.type)));
});


test('route body contains only history or results, never categories', async () => {
    const History = () => null, Results = () => null;
    let routeContent = 'typeList';
    let from;
    const Panel = await moduleFactory('widgets/side-menu/ui/RoutePanel.tsx', {
        'react/jsx-runtime': await import('react/jsx-runtime'), react: { Suspense: 'suspense' },
        'react-i18next': { useTranslation: () => ({ t: key => key }) },
        '@/entities/sidebar': { selectPanelState: () => ({ routeContent }), SideBarContent: { PointsList: 'pointsList' } },
        '@/entities/route': { selectFromPoint: () => from },
        '@/features/point-search': { SearchHistory: History, SearchResults: Results },
        '@/shared/lib': { useAppSelector: selector => selector() }, '@/shared/ui': { ListSkeleton: () => null }
    }, 'RoutePanel');
    assert.equal(Panel().props.children.props.children.type, History);
    assert.equal(Panel().props.children.props.children.props.direction, 'from');
    from = { id: 'entrance' };
    assert.equal(Panel().props.children.props.children.props.direction, 'to');
    from = undefined;
    assert.equal(Panel().props.children.props.children.props.direction, 'from');
    routeContent = 'pointsList';
    assert.equal(Panel().props.children.props.children.type, Results);
});
test('clearing one route endpoint preserves the other and invalidates pending auto-origin', async () => {
    const slice = await moduleFactory('entities/route/model/routeSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'routeSlice');
    let state = slice.reducer(undefined, slice.actions.setFromPoint({ id: 'from' }));
    state = slice.reducer(state, slice.actions.setToPoint({ id: 'to' }));
    const revision = state.revision;
    state = slice.reducer(state, slice.actions.clearRouteEndpoint('from'));
    assert.equal(state.from, undefined); assert.equal(state.to.id, 'to');
    assert.equal(state.revision, revision + 1);
});


test('route opening can fill entrance before destination and rejects a late response after closing', async () => {
    const slice = await moduleFactory('entities/route/model/routeSlice.ts', {
        '@reduxjs/toolkit': { createSlice }
    }, 'routeSlice');
    const empty = slice.reducer(undefined, { type: 'init' });
    const payload = { point: { id: 'entrance' }, revision: empty.revision };
    const filled = slice.reducer(empty, slice.actions.setDefaultFromPoint(payload));
    assert.equal(filled.from.id, 'entrance');
    assert.equal(filled.to, undefined);
    const closed = slice.reducer(empty, slice.actions.clearRoute());
    assert.equal(slice.reducer(closed, slice.actions.setDefaultFromPoint(payload)).from, undefined);
});
