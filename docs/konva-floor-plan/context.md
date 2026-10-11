# Context

`@eternal-encoders/konva-floor-plan` is the shared floor canvas for two apps:

- The public navigator renders a view-only map. It omits `editor` and `showGraph`. A room click calls `onRoomSelect` with that room's `pointId`. Route markers are passed as `children`.
- The admin dashboard edits the same geometry. It passes `editor` and `showGraph`, keeps a draft, and saves that draft itself.

Both apps must keep looking the same. Paint rules, door geometry, icons, and gesture behavior live here so they are not copied into each app.

## Boundary

This package paints a stage from props.

It does not:

- call `/api` or `/admin_api`
- use Redux or any app store
- save a floor
- edit names, types, colors, `pointId`, graph links, or building fields
- know about the navigator side menu, GPS prediction, or route requests

The app maps its floor payload into `FloorPlanModel` and color schemes, then renders `FloorPlan`. The app writes editor patches back into its own draft.

Coordinates are floor pixels. The floor origin is the top-left of the rectangle `floor.width` by `floor.height`.

## Read next

1. [model.md](model.md) — shapes, rooms, services, colors, graph
2. [canvas.md](canvas.md) — what the stage draws and how it moves
3. [editor.md](editor.md) — optional editing contract
4. [source.md](source.md) — files, public exports, build

## Compatibility

The navigator imports `FloorPlan` and these types: `AlignX`, `AlignY`, `IColorSchema`, `IColorTheme`, `IContainerShape`, `IDoorShape`, `IIconShape`, `IPointShape`, `IPolyShape`, `IRectangleShape`, `IRoom`, `IService`, `IShape`, `ITextShape`.

Keep those names and the `FloorPlan` props. A rename or a required new prop breaks the published consumer. Add optional props when the canvas grows.
