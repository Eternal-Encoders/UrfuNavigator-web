# Editor

`editor` is optional. With it unset, shapes are not draggable, arrow keys do nothing, and the graph is not interactive. Room clicks still call `onRoomSelect`.

The app owns the draft and the selection. This package reports changes and renders the data it is given.

```ts
interface FloorPlanEditor {
    selection: FloorPlanSelection | null
    onSelect: (selection: FloorPlanSelection | null) => void
    onGeometryChange: (edit: FloorPlanEdit) => void
}
```

`FloorPlanSelection` is `{ kind: 'room' | 'service' | 'graph', id }`.

`FloorPlanEdit` is one of:

- `{ kind: 'room', id, shape }`
- `{ kind: 'service', id, shape }`
- `{ kind: 'graph', id, x, y }`

The app replaces that room shape, service shape, or graph point in the same object tree passed as `floor`. Form inputs read that draft, so typed coordinates and dragged coordinates stay one value. This package does not store the draft.

## Interaction

- Click a room, service, or graph point to select it. The selected shape is drawn with a dashed stroke.
- Click empty floor to call `onSelect(null)`.
- Drag moves the shape origin, or the graph point `x` and `y`. Each drag frame calls `onGeometryChange`.
- Arrow keys nudge the selection by 1 floor pixel. Shift nudges by 10. The shell is focused on pointer down so keys reach the stage.
- Keys are ignored when the event target is inside `input`, `textarea`, `select`, or `[contenteditable="true"]`.

`placeShape` and `translateShape` return `null` for a `door`. Doors do not move. Nested rooms are found with `findRoom`.

Graph points are selectable only when `showGraph` is set. Changing a link, adding a point, or deleting a point is the app's job. The canvas only moves an existing point.

## Left to the app

Keep these in form inputs, not on the canvas:

- room and service names
- room `type` and `pointId`
- `colorSchema`, `isBorder`, `isFill`, and the scheme documents
- graph `links`
- floor `width` and `height`
- anything the admin API stores besides this geometry

The package does not call the admin API.
