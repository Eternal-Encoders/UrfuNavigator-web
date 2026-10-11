# Model

Types live in `src/model/types.ts` and are re-exported from `src/index.ts`.

The public floor payload and the admin floor document share this geometry. Admin records may carry extra fields and may set `pointId`, `type`, and `colorSchema` to `null`. Those three fields are optional and nullable. The renderer ignores fields it does not draw.

## Floor

`FloorPlanModel`:

- `width`, `height` — floor size in pixels
- `rooms` — `IRoom[]`
- `services` — `IService[]`
- `graph` — optional `FloorPlanGraphPoint[]`, drawn only when `showGraph` is set

`FloorPlanGraphPoint` is `{ id, x, y, links }`. `links` holds ids of other graph points. The canvas draws those edges. It does not change `links`.

## Rooms and services

`IRoom`: `id`, `displayableName`, `shape`, optional `pointId`, `type`, `children`, `colorSchema`, `isBorder`, `isFill`.

`children` mixes nested `IRoom` values and `IShape` values. Nested rooms are found by id when editing.

`IService`: `id`, `displayableName`, `shape`, optional `colorSchema`, `isBorder`, `isFill`. Services have no `pointId` and no `type`.

`onRoomSelect` receives `pointId` only. A room without `pointId` does not select a navigator point.

## Shapes

`IShape` is one of:

| `type` | Fields |
| --- | --- |
| `point` | `x`, `y` |
| `rectangle` | `x`, `y`, `width`, `height` |
| `poly` | `x`, `y`, `points` as `{ x, y }[]` relative to the origin |
| `container` | `x`, `y`, `width`, `height`, `alignX`, `alignY`, `children` |
| `text` | `x`, `y`, `alignX`, `alignY`, `text` |
| `icon` | `x`, `y`, `width`, `height`, `icon` filename |
| `door` | `wallId`, `length`, `offset`. No `x` or `y` |

`AlignX` is `'LEFT' | 'RIGHT' | 'CENTER'`. `AlignY` is `'TOP' | 'BOTTOM' | 'CENTER'`.

A door sits on a wall of its parent rectangle or polygon. `wallId` `0` and `2` are the horizontal walls, `1` and `3` the vertical walls. `offset` and `length` are along that wall. Doors are not moved by drag or nudge.

## Colors

`IColorSchema`: `id`, `displayableName`, `accentColor`, optional `whiteColorTheme`, optional `darkColorTheme`.

`IColorTheme` holds `buildingBorder`, `buildingFill`, `buildingBackground`, `roomBorder`, `roomFill`, `roomText`, and per-type maps `roomTypeBorder`, `roomTypeFill`, `roomTypeText`.

`MapTheme` is `'light' | 'dark'`. Light uses `whiteColorTheme`. Dark uses `darkColorTheme`.

Schemes are a separate prop, not a field of `FloorPlanModel`. A room or service points at a scheme with `colorSchema`. An unknown id falls back to `schemes[0]`. The floor background is `buildingBackground` of `schemes[0]`.
