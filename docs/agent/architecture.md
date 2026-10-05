# Architecture (Feature-Sliced Design)

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
    model/useAppEnvironment.ts  theme class on <html>, screen size, --keyboard-offset
    styles/index.css       Tailwind v4 + shadcn tokens (see design-system.md)
  pages/
    home/                  Yandex map of buildings + SideMenu
    institute/             FloorMap + SideMenu + PointDetails + floor/building/GPS controls
      model/useInstituteBuilding.ts  resolves building from slug, initial floor, GPS floor
  widgets/
    side-menu/             Left panel / mobile drawer; switches content by sidebar state
    floor-map/             Konva stage: rooms, services, route, route points, GPS marker
    point-details/         Right panel / mobile drawer with info about selected point
  features/
    point-search/          Search state slice, SearchTrigger, SearchBar, SearchResults, QuickTypes
    select-floor/          FloorSwitcher
    user-location/         useUserLocation (geolocation buffer) + GpsToggle
    change-theme/          ThemeSwitch (shadcn Switch)
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
    assets/                fonts, icons (point-types/, map/), legal.pdf
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
| `pointSearch`   | `features/point-search`     | Search direction (from/to) + query per direction |

`shared/lib/store.ts` uses the global `RootState`/`AppDispatch` types declared
in `app/store`, so `shared` never imports from `app`.

## API

All endpoints are injected into `shared/api/baseApi`:

- `entities/building`: `GET /api/buildings`, `GET /api/building?id=`
- `entities/floor`: `GET /api/floor?id=`, `GET /api/icons/:name`
- `entities/point`: `GET /api/points`, `GET /api/point?id=`, `GET /api/search`
- `entities/route`: `GET /api/path?from=&to=`

Base URL comes from `VITE_HOST` (see `shared/config/runtime`).

## Pages and connections

- `/` (HomePage): Yandex map placemarks and `SideMenu` (content `Institutes`).
  Clicking a placemark or `BuildingLink` navigates to `/institute/:slug`.
- `/institute/:intstName` (InstitutePage): sets side-menu content to `Empty`
  (from/to search triggers + back button). Selecting a search result
  (`features/point-search` → `useSelectPoint`) stores the point in `route`,
  switches floor and navigates to the result's building if it differs.
  `BackButton` clears the route, or goes to `/` if no route is set.
- Unknown routes redirect to `/`.
