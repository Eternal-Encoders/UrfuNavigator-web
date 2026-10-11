# `@eternal-encoders/konva-floor-plan`

The floor canvas is the published package `@eternal-encoders/konva-floor-plan`
(version `1.0.0`, GitHub Packages). This app and the admin dashboard both draw
through it, so rooms, services, routes, and graph points look the same in both.

The package paints a Konva stage from props. It does not call `/api` or
`/admin_api`, and it does not read Redux. Fetching a floor, predicting GPS,
and saving an edit stay in the app that embeds it.

## Install

`.npmrc` in this repo sends the `@eternal-encoders` scope to GitHub Packages
and reads the token from the environment. The token is not committed.

```
@eternal-encoders:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` to a GitHub token that can read packages, then install:

```powershell
$env:NODE_AUTH_TOKEN = "<GitHub token with read:packages>"
pnpm install
```

`package.json` already lists the package and the peers it needs: `react`,
`react-dom`, `konva`, `react-konva`, and `use-image`. Another app must install
those peers itself.

The image build uses the same `.npmrc`. GitHub Actions passes the `PACKAGER`
secret into the BuildKit secret `NODE_AUTH_TOKEN`. That secret needs
`read:packages` as well as permission to push the image. A local image build
is the same:

```powershell
$env:PACKAGER = $env:NODE_AUTH_TOKEN
docker build --secret id=NODE_AUTH_TOKEN,env=PACKAGER .
```

## View-only map

Leave `editor` and `showGraph` unset. A room click still reports `pointId`
through `onRoomSelect`. This app does that in `src/widgets/floor-map/ui/FloorMap.tsx`:
it loads the floor and the path, then renders `FloorPlan`. Route-point markers
are `children`, drawn in map coordinates on top of the floor.

```tsx
import { FloorPlan } from '@eternal-encoders/konva-floor-plan';

<FloorPlan
    floor={{
        width: mapSize.width,
        height: mapSize.height,
        rooms,
        services
    }}
    schemes={building.colorSchemes ?? []}
    theme={theme === Theme.Dark ? 'dark' : 'light'}
    viewport={{ width: innerWidth, height: innerHeight }}
    offsetX={mapOffsetX}
    dragInsetX={desktopMapInset(innerWidth)}
    routeSegments={routeSegments}
    gpsMarker={gpsMarker}
    onRoomSelect={(pointId) => dispatch(selectPoint(pointId))}
>
    {fromPoint}
    {toPoint}
</FloorPlan>
```

`offsetX` is the stage position when the floor or viewport changes. `dragInsetX`
is the left gap the pan limit keeps clear for the side menu. `desktopMapInset`
stays in this app (`src/widgets/floor-map/lib/geometry.ts`). Wheel zoom, drag,
and pinch are inside the package.

`routeSegments` is `Array<Array<{ x, y }>>`, one polyline per segment, in floor
coordinates. `gpsMarker` is `{ x, y, rotation }` in the same coordinates.

Shape and color types (`IRoom`, `IService`, `IShape`, `IColorSchema`, and the
rest) come from the package. This app re-exports them from `src/shared/api/types.ts`,
so the rest of the navigator keeps importing `@/shared/api`.

## Editor

The admin app passes `editor` and keeps the selection in its own draft. A click
selects a room, a service, or a graph point. Clicking empty floor clears the
selection. Dragging moves the shape origin, or the graph point's `x` and `y`.
Arrow keys nudge by 1; Shift nudges by 10. Keys are ignored while focus is in
an input, textarea, select, or contenteditable element.

```tsx
<FloorPlan
    floor={{
        width: draft.width,
        height: draft.height,
        rooms: draft.rooms,
        services: draft.services,
        graph: draft.graph
    }}
    schemes={draft.colorSchemes}
    theme="light"
    viewport={{ width, height }}
    showGraph
    editor={{
        selection,
        onSelect: setSelection,
        onGeometryChange: applyEdit
    }}
/>
```

`onGeometryChange` receives one of:

- `{ kind: 'room', id, shape }`
- `{ kind: 'service', id, shape }`
- `{ kind: 'graph', id, x, y }`

Write that patch into the same draft the form reads. Typing a coordinate in the
form updates the draft, and the canvas moves to match. Graph points are drawn
only when `showGraph` is set and `floor.graph` is present. Each graph point is
`{ id, x, y, links }`. The package draws the links; it does not edit them.

Names, types, colors, `pointId`, and building fields (name, color schemes,
floor size) stay in form inputs. The package does not save. The admin app still
writes the draft through `/admin_api`.

## Props

| Prop | Role |
| --- | --- |
| `floor` | `{ width, height, rooms, services, graph? }` |
| `schemes` | Building color schemes. `theme` picks `whiteColorTheme` or `darkColorTheme` |
| `theme` | `'light'` or `'dark'` |
| `viewport` | Stage size in pixels |
| `offsetX` | Initial horizontal stage position. Default `0` |
| `dragInsetX` | Left inset used by the pan limit. Default `0` |
| `showGraph` | Draw `floor.graph`. Default `false` |
| `routeSegments` | Route polylines in floor coordinates |
| `gpsMarker` | `{ x, y, rotation }` |
| `onRoomSelect` | Called with a room's `pointId` when that room is clicked |
| `editor` | Optional selection and geometry callbacks. Omit it for a view-only map |
| `children` | Extra Konva nodes in floor coordinates, such as route markers |

## Package repository

[docs/konva-floor-plan](konva-floor-plan/context.md) is context for an agent working in `Eternal-Encoders/konva-floor-plan`. Copy `README.md` to that repository root and copy the other files into its `docs/` directory.
