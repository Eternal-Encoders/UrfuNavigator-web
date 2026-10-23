# Map appearance overrides

Current policy, verified against source on 2026-10-22. This registry describes rendering overrides, not changes saved to the admin API. The payload and stored schemes remain unchanged.

## Values that supersede admin color schemes

Configured in [`FloorMap.tsx`](../../src/widgets/floor-map/ui/FloorMap.tsx), consumed by `konva-floor-plan`.

| Admin field | Effective web value | Scope and priority | Restore admin priority |
| --- | --- | --- | --- |
| Selected scheme `whiteColorTheme` / `darkColorTheme`: `roomTypeText[type]`, then `roomText` | `annotations.text.color: #60636C` in both themes | The explicit annotation color wins over scheme text colors for labels rendered through RoomText, including service/nested text. Requested uniform label styling. | Omit `annotations.text.color`. Scheme type text, then room text applies; missing colors use library fallbacks. |
| First scheme `whiteColorTheme` / `darkColorTheme`: `buildingBackground` | `background.color: #F4F5F7` light, `#0F1115` dark | The optional background layer fills the visible map behind rooms, covering the scheme background. Requested panel-matching surface. Room fills and borders remain visible. | Omit the entire `background` prop. Removing only `color` or setting `pattern: none` still paints the library fallback surface. |

Keeping dots/lines while exposing the scheme background needs a separate change to background composition; clearing `color` alone does not achieve it.

Room/type fill and border colors still come from the selected API scheme. This policy does not replace room coordinates, geometry or API data. The same #60636C is currently forced in dark mode too; it does not automatically follow the dark scheme.

## Web settings without matching admin fields

These are presentation/interaction options, not overwritten admin values in the current contract:

- Text: Golos UI, normal (Regular), screen size 9–16px, base fade range 4–8px multiplied by `fadeThresholdMultiplier: 0.75`, effective 3–6px, upright labels. Clear the multiplier or set 1 to restore 4–8px.
- Icons: screen size 16–26px, fade range 8–16px; upright except directional icons handled by the library.
- Background: `dots-and-lines`. Pattern ink is library-owned: RGB 65/76/94 light and 210/222/239 dark; line opacity 0.054, dot opacity 0.12. These are not read from admin palettes.
- Gestures: rotation activation 20°, sensitivity 1.2, active/release snap range 25° with `rotationSnapDuringGesture: true`, settling 220ms; double tap scale 2 and duration 220ms. The library default snap range is still 20°.

## Maintenance rule

For every new, changed or removed override, update this registry and `docs/agent/changelog.md` in the same change. Record the source field (or explicitly state that no admin field exists), effective value per theme, scope, precedence, reason, code location and how to restore source priority. Distinguish application overrides from library defaults and missing-data fallbacks. Never describe a rendering override as a change saved in the admin panel.

Library precedence and implementation locations: [override contract](../../../konva-floor-plan/docs/context/overrides.md).

## Building catalog icons

BuildingLink renders `building.icon.url` from API/admin directly, with object-fit contain and no local photo substitution or crop. This applies to mobile carousel/expanded cards and desktop rows. Existing local label/full-name/address/order metadata remains in buildingPhoto; it no longer determines the image source. Local photos and optional vector facade implementation remain stored but are not rendered by BuildingLink.

## Temporary search room highlight

FloorMap passes `focus` to renderer 1.6.0 while a browse-selected point matches the current floor/building. For the room whose pointId matches focus.pointId, `focus.fill` supersedes scheme type/room/building fill with #D8EAFE (light) or #36587C (dark); `focus.stroke` supersedes the normal border with #4A90E2 in both themes. This only changes rendering. Closing the preview, choosing another target or omitting focus restores normal scheme precedence. API data is never mutated. Graph points without a linked room can be centered but cannot tint a room.


### 2026-10-23 — Room selection highlight and search zoom
- Repositories: `UrfuNavigator-web` and `konva-floor-plan` (existing `feat/map-label-rotation` branch). Web consumes local renderer 1.7.0.
- Map-origin selected point now highlights matching room.pointId with the same light/dark fill and blue stroke as search, without camera movement. Dismissal clears selection and restores scheme colors. Room geometry and saved admin data are unchanged; graph points lacking a linked room cannot tint a room.
- Search sets focus.minScale=0.9; renderer animates translation and zoom together over 300ms on the same floor, preserves rotation and an already closer zoom, respects drag bounds and user interruption. Cross-floor focus remains immediate.
- Temporary paint overrides are controlled by FloorMap focus fill/stroke; remove those fields to restore admin schemes. Omit minScale to preserve prior search zoom.


### 2026-10-23 — Reduced search focus zoom
`UrfuNavigator-web`: search focus.minScale reduced from 0.9 to 0.6 (one third lower). A closer existing zoom remains unchanged. Camera policy only; no admin data or library defaults changed. Omit minScale to preserve the current zoom.


### 2026-10-23 — Search focus zoom 0.3
`UrfuNavigator-web`: search focus.minScale is now 0.3, superseding 0.6. Existing closer zoom is preserved. Consumer camera setting only; admin data and renderer defaults are unchanged.


### 2026-10-23 — Smooth room color transitions
Repositories: `konva-floor-plan` (feat/map-label-rotation) and `UrfuNavigator-web`. Local renderer 1.7.1 animates fill/stroke over 220ms for both search/map selection, deselection and scheme/theme changes. Interrupted transitions continue from displayed paint; reduced motion is immediate. No additional admin overrides or saved-data changes.


### 2026-10-23 — Initial floor camera position
Repositories: `UrfuNavigator-web`, `konva-floor-plan` (feat/map-label-rotation), local renderer 1.8.0. All floors open with floor rectangle center in the visible map region (desktop excludes 356px sidebar; mobile excludes 244px main panel). Floor numbered 1 queries explicit type=exit points; valid in-bounds entries preferred by explicit main-entrance name then stable ID. No entrance/network failure falls back to center; no inferred entrance from geometry. Initial first-floor map waits for the entrance query unless search already supplies a target. Existing RTK cache reused. initialView applies once per floor key, without selection/highlight changes, and before search focus. Camera setting only; no admin-data changes. Omit initialView to restore legacy placement.


### 2026-10-23 — Fit actual floor geometry rather than empty plan canvas
Repositories: `konva-floor-plan` (feat/map-label-rotation), `UrfuNavigator-web`; renderer 1.9.0. Library floorContentView determines the bounds of rooms/corridors/spatial services, ignoring decorative labels/icons. Web centers these bounds and fits them into the visible map region with 24px padding; mobile region excludes resting panel height, desktop excludes sidebar. Floor 1 retains explicit entrance anchor, with geometry-center fallback. Search retains camera priority. Initial view is one-time per floor; transitions between floors still use skeletons. Empty geometry falls back to declared dimensions. No admin-data changes; remove initialView.scale and pass dimension center to restore prior camera framing.


### 2026-10-23 — Preserve a consistent initial floor scale
`UrfuNavigator-web`: no longer passes contentView.scale to initialView. Actual geometry still determines the center (explicit entrance retains priority on floor 1), but floor changes use the common renderer initial scale based on viewport, independent of floor bounds. Search zoom remains unchanged. Library fit helpers remain available, unused for automatic zoom. Supersedes automatic content-fit scale from the prior entry.


### 2026-10-23 — Preserve camera between floors
Repositories: `konva-floor-plan` (feat/map-label-rotation), `UrfuNavigator-web`, renderer 1.10.0. FloorMap keeps the latest x/y/scale/rotation per building in a ref outside the conditionally mounted renderer. Floor changes restore it through initialCamera/cameraKey across skeletons and cached-floor updates; no per-frame React/Redux updates. Initial geometry/entrance centering only applies without a snapshot. Search focus runs after restoration and retains priority. Snapshots live for this map-page instance, not persisted across reloads; no admin-data changes.


### 2026-10-23 — Reference silhouette of floor 1
Repositories: `konva-floor-plan` (feat/map-label-rotation), `UrfuNavigator-web`, renderer 1.11.0. On other floors, web loads explicit floor number 1 through cached floor query without blocking current floor, validates building/floor identity and supplies a memoized referenceFloor. No floor 1 or failed reference request means no silhouette. Floor 1 never duplicates itself. Library unions spatial surfaces and draws only exterior rings, omitting interior shared walls/labels/icons/fill; noninteractive 20% outline below current geometry, light #60636C / dark #A5ABB6, 1.25px screen-width. Does not affect content centering/camera/drag bounds. Reference outline uses presentation colors rather than admin scheme for a neutral comparison layer; remove referenceFloor to restore prior rendering. No saved-data edits.


### 2026-10-23 — Align cropped floor origins with reference floor
Repositories: `konva-floor-plan` (feat/map-label-rotation), `UrfuNavigator-web`, renderer 1.12.0. INMIT/HTI floors 2–4 author stair coordinates 185 units left of floor 1 (despite different canvas widths). Web requests library alignment against cached reference floor and passes floorOffset; three or more uniquely agreeing stair landmarks required, otherwise original coordinates retained. Current rooms/services/routes/GPS/markers and search camera translate consistently; silhouette remains in reference coordinates. Initial geometry/entrance anchor includes offset. This presentation translation overrides raw local placement but never mutates backend/admin geometry; omit floorOffset to restore raw coordinates. No stretching or canvas-width heuristic.


### 2026-10-23 — Lift/icon-based floor alignment
Repositories: `konva-floor-plan` (feat/map-label-rotation), `UrfuNavigator-web`, renderer 1.13.0. Alignment recognizes lift/stair icons as well as stair types; explicit lift icon overrides mislabeled type=stair. Different landmark kinds cannot match; duplicate icons count once. Unique consensus still needs at least three room anchors. Verified against actual UralENIN floors 1–12 and INMIT/HTI floors -1–4. UralENIN offset +190 X for floor 2 and +2375 X for floors 3–12; no per-building hardcoded offsets, no saved-data mutation.


### 2026-10-23 — Separate FTI/HTI catalog cards
`UrfuNavigator-web`: shared BuildingCard supports expanded title, icon-by-name and disabled status. Mira catalog adds unavailable ФТИ (fti.svg) and ХТИ (Х), Химико-технологический институт, ул. Мира, 28 (hti.svg), linking to existing /institute/inmit-hti. Existing combined card becomes ИНМиТ (МТ), Институт новых материалов и технологий; HTI wording removed there. Named icons use a building-slice RTK query to /api/icons/:name, no floor-slice cross-import or stored signed URLs. Catalog additions/presentation overrides are local only; API building list, map markers and admin records unchanged.
