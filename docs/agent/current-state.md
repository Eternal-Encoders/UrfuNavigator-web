# Current implementation — 2026-10-22

This is the current-state index. Earlier dated sections in architecture/design-system and the changelog explain the evolution; when an old value differs, use this index and the override registry. Source is authoritative. No server/admin data is rewritten by UI overrides.

## Boundaries and delivery

- Web owns routing, API access, Redux, panels, user settings, translations, sensor permissions and application appearance policy. Code follows FSD and public slice exports; `pnpm check:fsd` enforces boundaries.
- The sibling konva-floor-plan library owns canvas rendering, room hit testing, annotation transforms and map gestures. Web consumes the vendored 1.4.0 archive, not an uncommitted import from sibling src. See [vendor provenance](../../vendor/README.md).
- No changes to API/backend/graphs/mobile repositories are part of this delivery. No publication or deployment is performed.

## Main flows and source map

| Area | Current behavior | Source |
| --- | --- | --- |
| Persistent navigator | One panel survives home/building navigation; data/content changes within it. Mobile search-only/base/expanded heights use fixed viewport geometry and keyboard handling. Manual collapse differs from map-interaction collapse, which restores after 1.5s. | src/widgets/side-menu/model/useSideMenu.ts; src/app/model/useAppEnvironment.ts |
| Buildings | Desktop rows are expanded immediately; mobile carousel morphs continuously into detail rows. Admin SVG icons render in a centered 75px square within a 100px slot. Local photo/illustration assets are retained but inactive. | src/widgets/side-menu/ui/InstitutesList.tsx; src/entities/building/ui/BuildingLink.tsx |
| Settings | Separate lazy Radix modal; desktop has no swipe handle and closes by its close button only. Mobile supports swipe/backdrop. Theme reveal cannot dismiss the modal through a retargeted double click. | src/widgets/side-menu/ui/SettingsLayer.tsx; src/widgets/side-menu/ui/SettingsOverlay.tsx |
| Campus selection | Entry at end of home building list opens a separate lazy modal; body intentionally empty. Underlying content/scroll stays mounted. | src/widgets/side-menu/ui/CampusLayer.tsx; src/widgets/side-menu/ui/CampusOverlay.tsx |
| Categories | All categories expands mobile panel to 90% without focusing input. Expanded grid stretches columns from a 100px minimum, with 8px gaps and 132px height. | src/features/point-search/ui/QuickTypes.tsx; src/app/styles/index.css |
| End-pull gestures | Category and building carousels share native scrolling plus a 144px end pull. Ring fills with elastic list motion; incomplete pulls return over 260ms. Full ring attempts one 30ms haptic; release opens the destination. | src/shared/lib/useCarouselEndPull.ts; src/shared/lib/haptic.ts |
| Mobile Back | Same-URL history guard restores settled panel checkpoints, selected room and drawer target height before normal page Back. Manual closes prune checkpoints; desktop has no handler. | src/app/model/usePanelBack.ts; src/app/lib/panelHistory.ts |
| Search | Browse/from/to query slots are separate. Ordinary search clears route and opens room details; route search changes only its requested endpoint. History uses the same selection hook. | src/features/point-search/model/pointSearchSlice.ts; src/features/point-search/model/useSelectPoint.ts |
| Category queries | All categories use /api/points type filtering without sending translated labels as room names. Current building/floor are exact filters. Prefix fetching and slicing emulate pagination because that endpoint has no offset. Free text uses /api/search. | src/entities/point/api/pointApi.ts |
| Theme and locale | Circular view-transition theme reveal with reduced-motion fallback; explicit locale is persisted, otherwise browser languages choose the available local locale. ru/en/zh/ar share translation keys; Arabic uses RTL. | src/features/change-theme/model/useThemeTransition.ts; src/shared/config/i18n/i18n.ts |
| Startup | Initial locale readiness precedes mount; settings/results/route content are lazy; skeletons cover loading; destination code/floor prefetch follows user intent and save-data preference. | src/main.tsx; src/app/model/usePagePreload.ts |
| Indoor policy | First floor numbered 1 is preferred. Text is Golos UI Regular #60636C, 9–16px, fade multiplier 0.75 (3–6px). Icon size 16–26px; rotation threshold 20°, sensitivity 1.2, snap range 25°, settle 220ms. | src/widgets/floor-map/ui/FloorMap.tsx; [override registry](map-overrides.md) |
| Compass | Sensor permission requested through GPS interaction; geographic north is projected and combined with renderer rotation. Unsupported/insecure/denied cases hide the needle. | src/features/user-location/model/usePhoneCompass.ts; src/widgets/floor-map/lib/north.ts |

## Presentation rules

Category/building card shadows and the circular expansion button use black at 4%. Page/portal text is not selectable; editable fields retain selection. Input styling avoids Safari focus zoom while preserving visual placeholder sizing. [Design details](design-system.md).

## Known limits and unfinished work

- Campus selector contains no campus data by request.
- Yandex API 3/dark basemap migration is not implemented; API 2.1 remains connected. There is no configured API 3 key. The unused API 3 type dependency was removed.
- Haptics are optional. Android system/browser settings may suppress vibration even after a successful API return. Safari switch fallback is not a guaranteed API and is especially unreliable during touchmove. Physical Android/iPhone feedback is unverified.
- Device compass needs trusted HTTPS; tests do not verify actual sensor calibration/permission dialogs.
- Mobile hardware Back/keyboard behavior, physical gesture feel and real-device Safari behavior still need device checks. Automated history tests are not a substitute for them.
- Category pagination transfers progressively larger prefixes. Endpoint filters restrict categories to the current floor/building; there is no cross-floor relevance ranking in this path.
- API/admin SVGs still contain embedded raster patterns with visible edge artifacts. Source assets have not been rewritten. Label/address/order metadata still comes partly from local buildingPhoto mappings.
- Floor annotation overlap is not automatically resolved. Text #60636C is forced in both themes. Background override masks scheme buildingBackground; see restoration instructions in the override registry.
- Historical loading measurements describe the specific benchmark build and local machine, not current production speed or mobile performance. [Measurement method](performance/2026-10-22-loading.md).

## Reproduction

Use pnpm install --frozen-lockfile, pnpm test, pnpm build and pnpm lint. Renderer changes require rebuilding/repacking its archive and refreshing web lockfile integrity. Restart Vite after replacing a local archive: the renderer must stay prebundled for React JSX interop.
