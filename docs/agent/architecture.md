# Architecture

Dated sections below retain implementation history. For current contracts, consult [current state](current-state.md) and [override registry](map-overrides.md). (Feature-Sliced Design)

The app is organised by FSD layers under `src/`. Imports only go downwards:
`app → pages → widgets → features → entities → shared`. Slices on the same
layer never import each other. Every slice exposes a public API through its
`index.ts`; outside code imports `@/layer/slice`, never deep paths.

`@/*` resolves to `src/*` (configured in `tsconfig.json` and `vite.config.ts`).

```
src/
  main.tsx                 Entry: renders <App /> from @/app
  app/
    ui/App.tsx             StrictMode + Suspense + Redux Provider + Helmet
    router/AppRouter.tsx   Routes: "/" → HomePage, "/institute/:intstName" → InstitutePage
    store/index.ts         combineSlices(...) + declares global RootState/AppDispatch/AppStore
    model/useAppEnvironment.ts  theme class on <html>, stable layout size and visible keyboard viewport
    styles/index.css       Tailwind v4 + shadcn tokens (see design-system.md)
  pages/
    home/                  Yandex map of buildings + SideMenu
    institute/             FloorMap + SideMenu + PointDetails + floor/building/GPS controls
      model/useInstituteBuilding.ts  resolves building from slug, initial floor, GPS floor
  widgets/
    side-menu/             Left panel / mobile drawer; switches content by sidebar state
    floor-map/             Loads floor data and renders @eternal-encoders/konva-floor-plan (docs/floor-plan.md)
    point-details/         Right panel / mobile drawer with info about selected point
  features/
    point-search/          Search state + recent points, SearchTrigger, SearchBar, SearchResults, QuickTypes, SearchHistory
    select-floor/          FloorSwitcher
    user-location/         useUserLocation (geolocation buffer) + GpsToggle
    change-theme/          ThemeSwitch (two shadcn Button choices, Redux theme)
    change-language/       LanguageSwitcher
  entities/
    building/              buildingApi, building helpers, BuildingLink, BuildingRedirect
    floor/                 floorApi (floor, icons), floorSlice (current floor + priority)
    point/                 pointApi, name/schedule helpers, type labels/icons, selectedPointSlice
    route/                 routeApi (path), routeSlice (from/to points)
    sidebar/               sidebarSlice (current/previous side-menu content)
    viewer/                viewerSlice (screen size, theme, GPS opt-in)
  shared/
    api/                   baseApi (RTK Query, endpoints injected by entities), DTO types, apiErrorText
    config/                runtimeConfig, i18n, lngs, PHONE_BREAKPOINT, GPS_BUFFER
    lib/                   cn, typed Redux hooks, useDrawer, GPS math
    ui/                    shadcn primitives + Panel, DragHandle
    assets/                fonts, icons (point-types/, map/, floor/), legal.pdf
```

## State

| Store key       | Owner                       | Purpose                                   |
|-----------------|-----------------------------|-------------------------------------------|
| `api`           | `shared/api` baseApi        | RTK Query cache                           |
| `floor`         | `entities/floor`            | Current floor id with priority            |
| `route`         | `entities/route`            | Selected start/end points                 |
| `selectedPoint` | `entities/point`            | Point shown in PointDetails               |
| `sidebar`       | `entities/sidebar`          | Side-menu content + history (one step)    |
| `viewer`        | `entities/viewer`           | Screen size, theme, GPS enabled           |
| `pointSearch`   | `features/point-search`     | Search direction, query per direction, recent points |

`shared/lib/store.ts` uses the global `RootState`/`AppDispatch` types declared
in `app/store`, so `shared` never imports from `app`.

## API

All endpoints are injected into `shared/api/baseApi`:

- `entities/building`: `GET /api/buildings`, `GET /api/building?id=`
- `entities/floor`: `GET /api/floor?id=`, `GET /api/icons/:name` (building icons in object storage)
- Floor-plan shape icons ship inside `@eternal-encoders/konva-floor-plan` (`floorIconSrc`), not `/api/icons`.
- `entities/point`: `GET /api/points`, `GET /api/point?id=`, `GET /api/search`
- `entities/route`: `GET /api/path?from=&to=`

Base URL comes from runtime config or `VITE_HOST` (see `shared/config/runtime`).
Local `.env.local` sets `/backend`; the development Vite proxy forwards it to
`https://api.test.how-to-navigate.ru` and removes that prefix. No object-storage
credentials are used by the frontend. The floor renderer is a local tarball in
`vendor/`; see README for source and provenance.

Recent points belong to `features/point-search/model/pointSearchSlice.ts`.
`SearchHistory` reads a Redux selector; selecting a result dispatches `rememberPoint`.
A feature-owned RTK listener middleware persists the resulting list (up to five
points) to localStorage. Storage parsing/serialization lives in the slice's `lib/`;
reducers contain no storage side effects. `app/store` composes the feature middleware.

## Architecture checks

`pnpm check:fsd` scans TypeScript/JavaScript imports and re-exports, including literal
dynamic imports, for upward dependencies, imports between slices of the same layer,
deep imports into slices, missing public `index.ts` files and misplaced slice files.
`pnpm lint` includes this check and ESLint. Use `pnpm build` for TypeScript + Vite.
Shared assets are resource paths, and shadcn's configured utils alias remains
`@/shared/lib/utils`; generated primitives stay unchanged.

## Pages and connections

- `/` (HomePage): Yandex map placemarks and `SideMenu` (content `Institutes`).
  Clicking a placemark or `BuildingLink` navigates to `/institute/:slug`.
- `/institute/:intstName` (InstitutePage): sets side-menu content to `Empty`
  (compact search trigger + campus button). Selecting a search result
  (`features/point-search` → `useSelectPoint`) stores the point in `route`,
  switches floor and navigates to the result's building if it differs.
  `BackButton` clears the route, or goes to `/` if no route is set.
- Unknown routes redirect to `/`.

## REMAKE panel and map interaction

`widgets/side-menu` owns panel layout and transient touch/animation state. Business
state (current content, search, route, floor) stays in Redux. Search, route and settings
open at 90% viewport height; campus cards open at 244px. Tall mobile states return to their saved base content and height on a short downward swipe;
the base panel toggles between 80px and 244px without dragging above it. Touch capture
covers the panel while preserving horizontal cards and vertical scrolling of long lists.
The settled height uses 180ms ease-out; direct dragging has no transition and reduced
motion follows the system preference.

Pages mark map surfaces and controls with `data-map-interaction`. The side-menu hook
collapses on pointer/touch, wheel, click and keyboard interaction with those regions;
it also blurs a focused search field. Both home Yandex map and institute floor canvas,
floor buttons, building redirects and GPS controls participate. Widgets do not import
other widgets. `RoutePanel`, `InstitutesList`, `SettingsPanel` compose lower-layer APIs.

## Mobile keyboard geometry

`app/model/useAppEnvironment` tracks two sizes: stable layout height and visible viewport
height. The layout baseline comes from `window.innerHeight`. While a mobile editable control
is focused and either window or VisualViewport height shrinks, the baseline is frozen through
keyboard dismissal. Width changes reset the baseline for orientation/window resizing.

Redux screen height and root `--viewport-height` use the stable layout baseline. The Yandex
map, floor canvas and expanded panel therefore keep the same dimensions and position when
the keyboard opens or closes. `--viewport-top` follows browser viewport panning; pinch zoom
belongs to the browser. Without VisualViewport, window resize supplies the visible height.

`--visible-viewport-height` independently tracks the area above the keyboard. A tall panel's
scrollable body is capped to that area minus its fixed top gap and header. The panel itself
stays at 90% of the stable layout, including when part of its background is behind the keyboard.
This preserves access to search results without resizing the map or the panel. Search inputs
use 16px mobile text to avoid iOS focus zoom. There is no keyboard-height bottom offset.

### Expanded panel visibility and resize ordering

`entities/sidebar` owns `panelExpanded` with public action/selector. The side-menu
publishes whether a tall mobile panel is open (search, results, route or settings).
The institute page uses that state to hide the secondary map UI group with Tailwind
`hidden`/`contents`: floor switcher, GPS, building redirects and point details. Hidden
controls leave the accessibility tree and cannot intercept input; they restore on
collapse, and desktop is unaffected. Widgets remain independent.

Settled expanded height is `90%` of the stable layout root; a CSS `max-height: 90%` applies
throughout the opening/closing animation. Layout effects reconcile content and viewport
before paint, skipping unchanged geometry on mount so Empty starts at 80px. This avoids
animating a stale large pixel height against a changing viewport; keyboard changes now only cap the scrollable body.

### Drawer gesture transitions and search focus

The side-menu keeps a transient saved base state (content + resting height) when opening tall
search/settings/route content. A downward gesture of at least 32px returns there first, rather
than directly to 80px. A base-panel gesture then toggles between 244px and 80px. Dragging up
from the compact search row never switches to search content. Map interactions explicitly
return to the compact base state and blur search.

Touchstart on an inactive search-row control is canceled and its tap is deferred until touchend.
A vertical gesture cancels touchend and the compatibility click; only an actual tap focuses the
input or invokes the trigger. Active-input taps keep native caret behavior. Horizontal cards and
scrollable vertical lists retain native scrolling; downward dragging at a list's top moves the drawer.
Direct drag height uses the initial rendered rectangle and total displacement, avoiding stale
incremental React state and jumps when grabbing a settling animation.

## Expanded home building list (Figma 2877:2911)

`entities/sidebar` exposes `SideBarContent.ExpandedInstitutes`. It uses the tall mobile panel
geometry and control-hiding flag, but its header is an inactive SearchTrigger plus Close,
not SearchBar. On home, upward swipes go 80px -> 244px -> detailed 90% layout, and downward
swipes reverse the sequence. Opening search from details saves that state as the search's
return target; map interaction returns to the 80px base instead. No keyboard changes are
made by opening or closing the detailed list.

`InstitutesList` keeps the same BuildingLink nodes and passes a semantic layout class.
The side-menu derives continuous progress from current height and passes it through SideMenuBody
to InstitutesList. CSS composes the same link/photo nodes from carousel to rows at every progress.
`widgets/side-menu/model/useBuildingCardMorph` remembers horizontal carousel origin and flags which
cards were visible before expansion; no layout clones or endpoint-only animations are used.
One requestAnimationFrame driver controls settling height and therefore all morph properties,
including when a settling transition is interrupted. Reduced-motion skips timed settling. `entities/building` owns card markup and presentation metadata alongside photos;
widget code consumes its public API and never imports private entity files.

Only API-provided buildings are shown. Design-provided names and addresses enrich matching
buildings; missing full descriptions fall back to server names, and missing addresses stay absent.

### Continuous campus motion

Progress is clamp((drawerHeight - 244) / (layoutHeight * 0.9 - 244), 0, 1), independent of committed
Redux content. It runs in both Institutes and ExpandedInstitutes, so reversing a drag reverses the
same geometry instead of starting a different animation. `--card-index` staggers incoming opacity;
`--carousel-offset` anchors the morph to the user's last horizontal scroll. Photos remain 100px square.
Label x/y trajectories and fade-out/fade-in have separate phases; detail text appears later. Header
icons crossfade/rotate and external actions fade out along the same progress. Body horizontal overflow
is clipped to avoid intermediate scrollbars, while the compact list retains native horizontal scrolling.

The height driver uses current rendered state, cubic ease-out and a cancellation handle. Touchstart
cancels settling immediately; a held finger freezes the presentation. Content and snap target update
without jumping progress. Short swipes keep directional next-state behavior; long catalog gestures
can traverse all three snap points. A canceled gesture returns to its previous target. Search focus
deferral and keyboard geometry are unchanged.


### Settings overlay (2026-10-22)

NavigatorLayout renders SettingsOverlay alongside SideMenu. SettingsOverlay composes a Radix Dialog portal and SettingsPanel; settingsOpen lives in entities/sidebar separately from content/prevContent. Opening settings never changes the primary navigator content. useSettingsSwipe handles local drag offset, dismissal and route cleanup; SideMenu cancels pending map restoration while settings opens. selectPanelExpanded combines the main drawer state with settingsOpen for map controls.


### Startup priorities and locale detection (2026-10-22)

main renders AppLoading and waits for the exported initial i18nReady promise before mounting App. NavigatorLayout owns intent preloading through app/model/usePagePreload (public pages/institute preload function plus floorApi prefetch); this keeps page/slice imports top-down. SettingsLayer defers the Radix overlay until requested and retains it after first use. SearchResults and Route body use lazy chunks under skeleton Suspense boundaries. BuildingPhotoImage is private to entities/building and observes actual carousel visibility before assigning noncritical sources.

Locale detector checks only explicit `urfuNavigator.language` and the ordered browser language list. It requests base-language local JSON with Russian fallback. LanguageSwitcher persists only explicit choices; automatically selected language remains free to follow browser preference on later visits. Performance samples and caveats live under docs/agent/performance.


### Library-owned canvas behavior (1.1.0)

`widgets/floor-map/ui/FloorMap` passes public `gestures` and `background` props to `@eternal-encoders/konva-floor-plan`. The renderer in the sibling library repository owns two-finger rotation/pan/zoom, one-finger pan, wheel zoom, release snapping, and the dots/lines background. Web no longer injects MapGestureController/FloorMapBackground children or searches/reorders internal canvas nodes. Current web policy: threshold 20°, sensitivity 1.2, release snap range 25°, settle 220ms; pattern dots-and-lines with surface #F4F5F7 / #0F1115 matching panels. Route-point markers remain application-owned children. Theme, loading, panels and map interaction collapse/restore stay in web. See vendor/README.md for local package provenance and rebuilding. Previous entries describing the injected controller/background are historical.


### Adaptive annotations (library 1.2.0)

FloorMap uses a stable FloorPlanAnnotationOptions constant and the public annotations prop. Library code owns beforeDraw size/rotation/opacity updates. Text screen font bounds are 9–16px, icons 16–26px; base fade ranges are 4–8px and 8–16px of original projected size; text fadeThresholdMultiplier 0.75 makes the effective text range 3–6px, while icons retain 8–16px. Directional icons follow the map; all other labels/icons remain upright. Authored coordinates, room hit targets, data loading and route/GPS logic remain unchanged.


### Phone compass (user-location feature)

GpsToggle owns the passive CompassNeedle and usePhoneCompass lifecycle. Permission is requested from GPS's click only; no page-load prompt. Sensor data stays in the feature's refs and never leaves the device. heading updates are circular/time-based low-pass rAF writes, not Redux/React frame state. Unsupported/insecure/denied/uncalibrated cases have no visible needle.

FloorMap computes calibrated geographic north through coordsPredictor at the building reference location/altitude. Library onRotationChange publishes canvas angle. Root CSS variables --floor-map-north, --floor-map-rotation and --floor-map-compass-visibility combine with the needle's --phone-compass-heading, then reset on floor/page lifecycle. The map callback is display-only and lightweight. Sensor listeners stop on GPS off/unmount; document visibility resets stale readings. No GPS movement-heading fallback is used.


Current web gesture override: release snapping is ±25°; activation threshold remains 20°, sensitivity 1.2 and settle 220ms. Library default range remains 20° for other consumers.


### Map override registry

[map-overrides.md](map-overrides.md) is the explicit inventory of appearance overrides, their source fields, priority, theme scope and restoration paths. Update it whenever an override changes.


### Ordinary search versus route endpoint selection

point-search owns separate browse/from/to query slots. Base SearchTrigger starts browse mode and clears entities/route plus old selectedPoint; route triggers explicitly select from/to. Base QuickTypes also starts browse, whereas categories within active search retain its target. useSelectPoint opens room details and clears route only for browse; explicit route selection updates a single endpoint. Ordinary search never writes an endpoint. Search history uses the same hook.


### Category lookup

pointApi.searchPoints routes typed categories to /api/points, passing type and current building/floor filters; the localized category name is display-only. Ordinary text uses /api/search. Because points has no offset, category queries request a growing prefix and transform it into the requested page. Category membership remains API/admin data, with no hardcoded room lists in web.


### Settings desktop interactions

Settings swipe/handle apply only through the 1200px phone breakpoint. Theme snapshots are pointer-transparent; the Radix settings dialog ignores outside interactions during the theme-transition class lifetime so retargeted double-clicks cannot dismiss it. Normal close/backdrop behavior resumes after the reveal.


Desktop settings dismissal policy: above 1200px only the explicit close button dismisses through user interaction. Escape and outside clicks are prevented, including the lazy fallback backdrop. Mobile retains backdrop/swipe dismissal. Route-change lifecycle cleanup still applies.


Mobile All categories uses SideBarContent.Categories, a full-height drawer state with QuickTypes and an unfocused search trigger. It shares the regular drawer animation, map-control visibility and base restoration. Fewer categories returns to Empty. TypeList remains the input-focused search mode; desktop all-category toggling stays local.


QuickTypes uses its slice-local useCategoryPull hook only for compact mobile category lists. It keeps native horizontal scrolling and claims a non-passive touchmove only for a leftward pull past the end. A 144px pull arms opening on release, with CSS ring progress; cancellation/multi-touch/reversal reset it. The existing toggle owns all-category state and drawer expansion. No map gesture handlers are changed.


Category end-pull haptics live in point-search/lib/categoryHaptic. The gesture hook owns helper disposal and calls pulse synchronously on the first full-ring threshold crossing per touch gesture. Native vibrate(30) is preferred; supported checkbox switch click is a best-effort Safari fallback when transient user activation is available. It never determines gesture success and has no persistent state or permission prompts.


Android haptic calls are not gated on transient userActivation.isActive: Vibration API requires sticky activation, enforced by the browser. Only the Safari switch fallback checks transient activation. A successful vibrate return does not prove a physical vibration occurred.


Home campus selection: InstitutesList appends a Choose campus entry, included in mobile card morph geometry. Click or completed mobile end-pull sets campusOpen independently of content/prevContent. Lazy CampusLayer renders a separate Radix dialog portal with an empty body over the persistent main panel. Closing restores focus; navigation closes the modal. Generic carousel gestures/haptics live in shared/lib (useCarouselEndPull, haptic), shared by categories and campus picker.


### Mobile panel Back history

NavigatorLayout installs app/model/usePanelBack only at phone widths. app/lib/panelHistory owns one same-URL history guard and a stack of settled UI snapshots; it preserves BrowserRouter history state. Snapshots include sidebar content/history, settings/campus flags, selected point ID and drawer resting height. Back restores a checkpoint before page navigation; manual closes prune it. Entities/sidebar exposes setRestingHeight and restorePanel (revision-based), and useSideMenu restores height while cancelling gesture/map-restore ownership. Drawer animation frames do not create checkpoints. Desktop has no panel guard; keyboard Back handling remains browser-owned.
