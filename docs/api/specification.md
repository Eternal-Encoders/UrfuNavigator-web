# UrfuNavigator API specification

HTTP contract for clients and for agents integrating this service from another repository. Behavior below matches the handlers in this codebase as of 2026-10-03.

Base URL example: `http://127.0.0.1:5000`. There is no global API prefix. Interactive OpenAPI is served at `/docs` when the process is running (`docs/swagger.json`).

## Conventions

- JSON uses camelCase.
- ObjectIDs are 24-character hex strings.
- Public success responses omit audit fields.
- Admin document responses include `id`, `displayableName`, `createdAt`, `updatedAt`, `author`, `lastUpdatedBy`.
- Error responses are plain text (`Content-Type` text), not `{ "error": ... }`.
- `POST` create routes that return an id use `201` and `{ "id": "<hex>" }`.
- Deletes that succeed use `204` with an empty body.
- Admin routes require header `Authorization: Bearer <jwt>`.
- Roles that may call `/admin_api` and `POST /api/login`: `writer`, `admine`. Role `reader` cannot.
- Icon upload field `image` is standard base64 (Go `[]byte` JSON encoding).

### Entity summary (public)

```json
{ "id": "hex", "displayableName": "string" }
```

### Created

```json
{ "id": "hex" }
```

### Graph point types

`corridor`, `auditorium`, `dinning`, `exit`, `stair`, `toilet-m`, `toilet-w`, `cafe`, `vending`, `coworking`, `atm`, `wardrobe`, `print`, `deanery`, `students`, `other`.

### Weekday time

```json
{ "start": 0, "end": 0, "isDayOff": false }
```

`start` and `end` are integers stored as sent. Week object keys: `monday`, `tuesday`, `wednesday`, `thursday`, `friday`, `saturday`, `sunday`.

### Shapes

Every shape has `"type"`. Extra fields:

| type | fields |
| --- | --- |
| `point` | `x`, `y` (numbers) |
| `rectangle` | `x`, `y`, `width`, `height` |
| `poly` | `x`, `y`, `points` (point shapes) |
| `container` | `x`, `y`, `width`, `height`, `alignX`, `alignY`, `children` (shapes) |
| `text` | `x`, `y`, `alignX`, `alignY`, `text` |
| `icon` | `x`, `y`, `width`, `height`, `icon` (filename string) |
| `door` | `wallId` (int), `length`, `offset` |

`alignX`: `LEFT` \| `RIGHT` \| `CENTER`. `alignY`: `TOP` \| `BOTTOM` \| `CENTER`.

---

## Health

### `GET {DEFAULT_PATH}/`

`DEFAULT_PATH` is a server env value (often empty or `/`). Response `200` plain text `OK`.

---

## Public API

No authentication.

### `GET /api/buildings`

`200` array of Building (public).

`404` text if any building icon cannot be loaded from object storage.
`500` text on store failure.

### `GET /api/building?id={buildingId}`

Query `id` required.

`200` Building (public).
`400` if `id` is missing or not an ObjectID.
`404` if the icon is missing.
`500` on store failure. A missing building is reported as `500` with text `Something went wrong in GetBuilding` (public handlers do not map that case to `404`).

### `GET /api/floor?id={floorId}`

Query `id` required.

`200` Floor detail (public): rooms, services, and graph points inlined. Child arrays are unordered.
`400` if `id` is missing or invalid.
`500` on store failure, including a missing floor.

### `GET /api/points`

All query parameters optional.

| Query | Meaning |
| --- | --- |
| `buildingId` | ObjectID |
| `floorId` | ObjectID |
| `type` | one graph point type; matches if the point's `types` contains it |
| `name` | case-insensitive substring of `names.name` |
| `length` | max documents, default `40` |

`200` array of Graph point (public). Empty array when nothing matches.
`400` on a bad ObjectID.
`500` on store failure.

### `GET /api/point?id={pointId}`

`200` Graph point (public).
`400` if `id` is missing or invalid.
`500` on store failure, including a missing point.

### `GET /api/search?name={text}&length={n}`

`name` required. `length` optional, clamped to `1..40`, default `40`.

Uses MongoDB Atlas Search index `point_search`. Returns only points that have `names[0]`.

`200` array of Graph point (public), possibly empty.
`400` if `name` is missing.
`500` if the search index is missing or the query fails.

### `GET /api/path?from={pointId}&to={pointId}`

Both query parameters required ObjectIDs.

`200`:

```json
{
  "result": {
    "<buildingId>": {
      "<floorId>": [
        [ { "graph point": "..." } ]
      ]
    }
  }
}
```

`result` maps building id → floor id → segments. Each segment is an ordered array of public graph points. One building stays under one building key. Two buildings produce two building keys and require `exit` points in both; otherwise `500` with text `can't find exit in start building` or `can't find exit in end building`.

`400` if `from` or `to` is missing or invalid.
`500` if a point is missing or routing fails. The body may be the internal error string.

### `GET /api/icons/{icon}`

`icon` is a filename and must end with `.svg` and must not contain `/` or `\`.

`200` Icon URL. `400` if the name is invalid. `404` text `Cannot get icon from object storage` if presign fails.

### `POST /api/login`

```json
{ "login": "string", "password": "string" }
```

`200`:

```json
{
  "token": "jwt",
  "expiresAt": "RFC3339 time",
  "login": "string",
  "role": "writer"
}
```

Token is HS256. Claims include `userId`, `login`, `role`, `sub` (user id hex), `exp`, `iat`. Default lifetime is 24 hours (`JWT_EXPIRES_IN_HOURS`).

`400` if body is invalid or login/password is empty.
`401` text `Unauthorized` for unknown user or bad password.
`403` text `Forbidden` when the role is not `writer` or `admine`.

---

## Public response objects

### Building

```json
{
  "id": "hex",
  "displayableName": "string",
  "floors": [{ "id": "hex", "displayableName": "string" }],
  "url": "string",
  "latitude": 0,
  "longitude": 0,
  "icon": { "name": "file.svg", "url": "https://...", "expiresAt": "RFC3339" },
  "colorSchemes": [],
  "gps": [{ "centreAltitude": 0, "floorId": "hex" }]
}
```

A floor id that does not resolve still appears, with `displayableName` set to `""`.

Unresolved color schema ids are omitted from `colorSchemes`.

### Color schema (public building)

```json
{
  "id": "hex",
  "displayableName": "string",
  "accentColor": "string",
  "whiteColorTheme": {
    "buildingBorder": "string",
    "buildingFill": "string",
    "buildingBackground": "string",
    "roomBorder": "string",
    "roomFill": "string",
    "roomText": "string",
    "roomTypeBorder": { "auditorium": "string" },
    "roomTypeFill": { "auditorium": "string" },
    "roomTypeText": { "auditorium": "string" }
  },
  "darkColorTheme": {}
}
```

Theme string fields are omitted when unset. Type maps are omitted when empty.

### Floor detail

```json
{
  "id": "hex",
  "displayableName": "string",
  "buildingId": "hex",
  "elevation": 0,
  "width": 0,
  "height": 0,
  "rooms": [],
  "services": [],
  "graph": [],
  "gps": {
    "altitude": 0,
    "linear": {
      "x": { "b1": 0, "b2": 0, "a": 0 },
      "y": { "b1": 0, "b2": 0, "a": 0 }
    },
    "forces": [{ "point": { "x": 0, "y": 0 }, "force": { "x": 0, "y": 0 } }]
  }
}
```

`gps` is omitted when the floor has none.

### Room (public)

```json
{
  "id": "hex",
  "displayableName": "string",
  "shape": { "type": "rectangle", "x": 0, "y": 0, "width": 0, "height": 0 },
  "pointId": "hex",
  "type": "auditorium",
  "children": [],
  "colorSchema": "hex",
  "isBorder": true,
  "isFill": true
}
```

`pointId`, `type`, and `colorSchema` are omitted when unset. On the admin storage document, `pointId` and `colorSchema` are present as null or hex according to the driver; `type` likewise. Clients should tolerate null.

### Service (public)

```json
{
  "id": "hex",
  "displayableName": "string",
  "shape": { "type": "point", "x": 0, "y": 0 },
  "colorSchema": "hex",
  "isBorder": true,
  "isFill": true
}
```

### Graph point (public)

```json
{
  "id": "hex",
  "displayableName": "string",
  "buildingId": "hex",
  "floorId": "hex",
  "x": 0,
  "y": 0,
  "links": ["hex"],
  "types": ["exit"],
  "names": [{ "name": "string", "translations": [{ "language": "ru", "value": "string" }] }],
  "time": { "monday": { "start": 0, "end": 0, "isDayOff": false } },
  "description": "string",
  "info": "string",
  "isPassFree": false
}
```

Empty `description` and `info` are omitted (`omitempty`). `time` is omitted only when the whole value is empty; a stored week is returned in full.

### Icon URL

```json
{ "name": "file.svg", "url": "https://...", "expiresAt": "RFC3339" }
```

Default URL lifetime is 3600 seconds (`S3_PRESIGN_TTL_SEC`).

---

## Admin API

Prefix `/admin_api`. Middleware: valid Bearer JWT, then role `writer` or `admine`.

`401` text `Unauthorized` when the token is missing, invalid, or expired.
`403` text `Forbidden` when the role is not allowed.

Admin list and get routes return storage documents (id arrays, icon filename, audit fields), not the expanded public DTOs. Exceptions: user routes return `UserAdminResponse` and never `passwordHash`.

Common failures: `400` plain text for bad ids or bad JSON, `404` text `Not found`, `500` text `Internal server error`.

### Users

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/admin_api/users` | | `200` UserAdmin array |
| GET | `/admin_api/users/{id}` | | `200` UserAdmin |
| POST | `/admin_api/users` | CreateUser | `201` Created |
| PUT | `/admin_api/users/{id}` | UpdateUser | `200` UserAdmin |
| DELETE | `/admin_api/users/{id}` | | `204` |

CreateUser (all fields used as sent; `login` and `password` required):

```json
{
  "displayableName": "string",
  "login": "string",
  "password": "string",
  "role": "writer"
}
```

UpdateUser: every field optional. Omitted fields stay unchanged. Empty `password` does not clear the hash.

```json
{
  "displayableName": "string",
  "login": "string",
  "password": "string",
  "role": "admine"
}
```

UserAdmin:

```json
{
  "id": "hex",
  "displayableName": "string",
  "createdAt": "RFC3339",
  "updatedAt": "RFC3339",
  "author": "hex",
  "lastUpdatedBy": "hex",
  "login": "string",
  "role": "writer"
}
```

### Buildings

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/admin_api/buildings` | | `200` Building storage array |
| GET | `/admin_api/buildings/{id}` | | `200` Building storage |
| POST | `/admin_api/buildings` | Building storage | `201` Created |
| PUT | `/admin_api/buildings/{id}` | Building storage | `200` updated document |
| DELETE | `/admin_api/buildings/{id}` | | `204` |
| POST | `/admin_api/buildings/{id}/floors` | Floor storage | `201` Created, floor linked |
| POST | `/admin_api/buildings/{id}/color-schemes` | Color schema storage | `201` Created, schema linked |
| POST | `/admin_api/buildings/{id}/gps` | BuildingGps | `204` |
| DELETE | `/admin_api/buildings/{id}/floors/{floorId}` | | `204` unlink and delete floor |
| DELETE | `/admin_api/buildings/{id}/color-schemes/{schemaId}` | | `204` unlink and delete schema |
| DELETE | `/admin_api/buildings/{id}/gps/{floorId}` | | `204` remove GPS entry with that `floorId` |

Building storage:

```json
{
  "id": "hex",
  "displayableName": "string",
  "createdAt": "RFC3339",
  "updatedAt": "RFC3339",
  "author": "hex",
  "lastUpdatedBy": "hex",
  "floors": ["hex"],
  "url": "string",
  "latitude": 0,
  "longitude": 0,
  "icon": "file.svg",
  "colorSchemes": ["hex"],
  "gps": [{ "centreAltitude": 0, "floorId": "hex" }]
}
```

On create, the server assigns `id` when it is empty and overwrites timestamps and `lastUpdatedBy`. Send `icon` as a filename, not a URL.

`DELETE /admin_api/buildings/{id}` also deletes linked floors and those floors' rooms, services, and graph points, plus linked color schemas.

### Floors

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/admin_api/floors` | | `200` Floor storage array |
| GET | `/admin_api/floors/{id}` | | `200` Floor storage |
| POST | `/admin_api/floors` | Floor storage | `201` Created, not auto-linked to a building |
| PUT | `/admin_api/floors/{id}` | Floor storage | `200` updated document |
| DELETE | `/admin_api/floors/{id}` | | `204`, also deletes rooms, services, graph points |
| POST | `/admin_api/floors/{id}/rooms` | Room storage | `201` Created and linked |
| POST | `/admin_api/floors/{id}/services` | Service storage | `201` Created and linked |
| POST | `/admin_api/floors/{id}/graph-points` | Graph point storage | `201` Created and linked |
| DELETE | `/admin_api/floors/{id}/rooms/{roomId}` | | `204` unlink and delete |
| DELETE | `/admin_api/floors/{id}/services/{serviceId}` | | `204` unlink and delete |
| DELETE | `/admin_api/floors/{id}/graph-points/{pointId}` | | `204` unlink and delete |

Floor storage:

```json
{
  "id": "hex",
  "displayableName": "string",
  "createdAt": "RFC3339",
  "updatedAt": "RFC3339",
  "author": "hex",
  "lastUpdatedBy": "hex",
  "buildingId": "hex",
  "elevation": 0,
  "width": 0,
  "height": 0,
  "rooms": ["hex"],
  "services": ["hex"],
  "graph": ["hex"],
  "gps": {
    "altitude": 0,
    "linear": {
      "x": { "b1": 0, "b2": 0, "a": 0 },
      "y": { "b1": 0, "b2": 0, "a": 0 }
    },
    "forces": [{ "point": { "x": 0, "y": 0 }, "force": { "x": 0, "y": 0 } }]
  }
}
```

### Rooms, services, graph points, color schemas

Same CRUD pattern. Standalone create does not update a parent floor or building.

| Resource | Path | Storage body |
| --- | --- | --- |
| Rooms | `/admin_api/rooms` | Room |
| Services | `/admin_api/services` | Service |
| Graph points | `/admin_api/graph-points` | Graph point |
| Color schemas | `/admin_api/color-schemes` | Color schema |

Each resource:

| Method | Path | Success |
| --- | --- | --- |
| GET | `/{resource}` | `200` array |
| GET | `/{resource}/{id}` | `200` document |
| POST | `/{resource}` | `201` Created |
| PUT | `/{resource}/{id}` | `200` updated document |
| DELETE | `/{resource}/{id}` | `204` |

Room storage adds, on top of audit fields: `shape`, `pointId`, `type`, `children`, `colorSchema`, `isBorder`, `isFill`.

Service storage adds: `shape`, `colorSchema`, `isBorder`, `isFill`.

Graph point storage adds: `buildingId`, `floorId`, `x`, `y`, `links`, `types`, `names`, `time`, `description`, `info`, `isPassFree`. Same field shapes as the public graph point, plus audit fields. `description` and `info` are always present on the storage model (no `omitempty`).

Color schema storage adds: `accentColor`, `whiteColorTheme`, `darkColorTheme`, plus audit fields. Theme shape matches the public color schema section.

`PUT` replaces the stored document fields from the body after forcing `id` to the path id and refreshing `updatedAt` and `lastUpdatedBy`. Send a full document. `createdAt` and `author` are not preserved unless the body includes them.

### Icons

| Method | Path | Body | Success |
| --- | --- | --- | --- |
| GET | `/admin_api/icons/{icon}` | | `200` Icon URL |
| POST | `/admin_api/upload_icon` | `{ "filename": "file.svg", "image": "<base64>" }` | `200` text `ok` |
| DELETE | `/admin_api/delete_icon` | `{ "filename": "file.svg" }` | `200` text `ok` |

Objects are stored as `building-icons/{filename}` with content type `image/svg+xml`. `filename` must end with `.svg` and must not contain path separators.

---

## Client flow

1. `GET /api/buildings` for the campus list, icons, palettes, and floor ids.
2. `GET /api/floor?id=` for geometry and the navigation graph of one floor.
3. `GET /api/search?name=` or `GET /api/points` to pick endpoints.
4. `GET /api/path?from=&to=` and draw `result[buildingId][floorId]` segments on the matching floors.
5. Admin edits start with `POST /api/login`, then Bearer calls under `/admin_api`. Use nested `POST` routes when the new floor, room, service, graph point, or color schema must be linked to its parent.
