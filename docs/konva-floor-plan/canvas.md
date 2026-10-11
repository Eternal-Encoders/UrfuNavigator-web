# Canvas

`FloorPlan` (`src/ui/FloorPlan.tsx`) is the only component apps render. It owns one Konva `Stage` and one `Layer`.

Draw order:

1. Floor background rectangle, when the first scheme has `buildingBackground` and the floor has a size.
2. Rooms, then services.
3. Route polylines, when `routeSegments` is non-empty.
4. Graph, when `showGraph` is set and `floor.graph` is present.
5. GPS marker, when `gpsMarker` is set.
6. `children`, in floor coordinates. The navigator uses this for route-point markers.

## Props

| Prop | Default | Role |
| --- | --- | --- |
| `floor` | required | `FloorPlanModel` |
| `schemes` | required | `IColorSchema[]` |
| `theme` | required | `'light'` or `'dark'` |
| `viewport` | required | Stage size in screen pixels |
| `offsetX` | `0` | Stage `x` applied when `offsetX` or the viewport size changes |
| `dragInsetX` | `0` | Extra left gap in the pan limit. The navigator passes its side-menu inset. The package does not compute that inset |
| `showGraph` | `false` | Draw `floor.graph` |
| `routeSegments` | | `Array<Array<{ x, y }>>`, one polyline per segment |
| `gpsMarker` | | `{ x, y, rotation }` in floor coordinates |
| `onRoomSelect` | | `(pointId: string) => void` |
| `editor` | | See [editor.md](editor.md). Omit it for a view-only map |
| `children` | | Extra Konva nodes |

When `offsetX` or `viewport` changes, the stage scale is set to `min(viewport.width, viewport.height) / 3500` and the stage position is set to `{ x: offsetX, y: 0 }`. A pan the user already made is replaced by that position. Do not reset the stage on unrelated prop changes.

## Paint

`paintForRoom` and `paintForService` in `src/lib/paint.ts` return `{ fill, stroke, text }`.

- Fill is omitted when `isFill` is `false`. Otherwise type fill, then room fill, then building fill. Services have no type, so they skip the type maps.
- Stroke is `#7f7f7f` when `isBorder` is `false`. Otherwise type border, then room border, then building border.
- Text color is type text, then room text.

## Doors

`src/lib/doors.ts` turns a rectangle or polygon into walls and clips a door span onto one wall. A container uses the first rectangle or polygon child, shifted by the container origin. A span shorter than `0.5` is not drawn.

## Icons

`src/assets/floor/` holds the floor SVGs. `floorIconSrc` maps an icon name to a file. It adds `.svg` when the name has no extension and compares filenames with NFC normalization. `RoomIcon` loads that URL with `use-image`. An unknown name uses `src/assets/placeholder.svg`.

Icon filenames are the names stored on shapes, including the Russian filenames already in that folder. Renaming a file without keeping the lookup key hides existing icons.

## Gestures

`src/ui/useMapGestures.ts` handles wheel zoom, two-finger pinch and rotate, and the stage drag bound. `boundPosition` in `src/lib/geometry.ts` keeps part of the floor inside the viewport. `dragInsetX` is added on the left of that limit so a side panel can cover the screen edge without covering the whole map.

The stage stays draggable when `editor` is set. Shape drag must not be treated as a stage click. A click on empty stage clears the editor selection only when the pointer moved less than 3 pixels.
