# Source

```
src/
  index.ts                 Public exports
  model/types.ts           Floor, shape, color, editor types
  lib/paint.ts             Scheme lookup and fill, stroke, text
  lib/doors.ts             Walls and door spans
  lib/geometry.ts          Pan limit, distance, rotation
  lib/edit.ts              Find, place, translate, nudge
  assets/floor/            Floor SVGs and floorIconSrc
  assets/placeholder.svg   Fallback icon
  ui/FloorPlan.tsx         Stage
  ui/shapes.tsx            Rooms and services
  ui/Room.tsx              Room group
  ui/RoomText.tsx
  ui/RoomIcon.tsx
  ui/GraphLayer.tsx
  ui/RouteOverlay.tsx
  ui/GpsMarker.tsx
  ui/useMapGestures.ts
```

`src/index.ts` exports the types, `FloorPlan`, `FloorPlanProps`, `floorIconSrc`, the door helpers (`clipSpan`, `doorWalls`, `localRectangleDoor`, `polyWalls`, `rectangleWalls`, `shapeOrigin`), the edit helpers (`findRoom`, `nudgeSelection`, `placeShape`, `translateShape`), and the paint helpers (`buildingBackground`, `paintForRoom`, `paintForService`).

Apps should render `FloorPlan`. The helpers are public so an app can preview paint or apply the same nudge the canvas uses. Do not export a second stage component.

## Build

Vite library mode emits one ES module, `dist/index.js`. `tsc -p tsconfig.json` emits `dist/index.d.ts` only. `package.json` points `types` and `import` at those files and publishes `dist` only.

Peers, also listed as `external` in the Vite build: `react`, `react-dom`, `react/jsx-runtime`, `konva`, `react-konva`, `use-image`. They are not bundled.

Floor SVGs are loaded in the library build and must still resolve after publish. Consumers do not copy the SVG folder.

`dist` is a build output. Publish from a build on a version tag. Publishing the same version again fails.

Package name is `@eternal-encoders/konva-floor-plan`. `publishConfig.registry` is `https://npm.pkg.github.com`.
