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
- Gestures: rotation activation 20°, sensitivity 1.2, release snap range 25°, settling 220ms; double tap scale 2 and duration 220ms. The library default snap range is still 20°.

## Maintenance rule

For every new, changed or removed override, update this registry and `docs/agent/changelog.md` in the same change. Record the source field (or explicitly state that no admin field exists), effective value per theme, scope, precedence, reason, code location and how to restore source priority. Distinguish application overrides from library defaults and missing-data fallbacks. Never describe a rendering override as a change saved in the admin panel.

Library precedence and implementation locations: [override contract](../../../konva-floor-plan/docs/context/overrides.md).

## Building catalog icons

BuildingLink renders `building.icon.url` from API/admin directly, with object-fit contain and no local photo substitution or crop. This applies to mobile carousel/expanded cards and desktop rows. Existing local label/full-name/address/order metadata remains in buildingPhoto; it no longer determines the image source. Local photos and optional vector facade implementation remain stored but are not rendered by BuildingLink.
