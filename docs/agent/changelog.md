## 2026-10-22 — Delegate canvas behavior to konva-floor-plan 1.1.0

- Replaced web's MapGestureController/useMapRotation/lib rotation and FloorMapBackground with public library `gestures`/`background` props. Preserved threshold 20°, sensitivity 1.2, release snap range 20°, 220ms settle and theme-matched dots/lines.
- Library now owns canvas transforms, gesture cleanup, reduced motion and background draw order; web keeps settings, theme choice, data fetching, panels and route-point markers.
- Installed the local packed 1.1.0 library from its `feat/map-label-rotation` branch, with provenance in vendor/README.md. Source follows FSD in the sibling repo; labels are unchanged.
- Validation: library build/typecheck and four regression tests; web build/lint/FSD; production browser touch, pan and rotated wheel tests passed. Browser finger 19/25/35/30/80° -> map 0/6/18/12/72°, pinch 1.2× and release 90°. Wheel anchor error 0px at 90° rotation; single pan 10×5px. Real phone feel still requires user verification. Final packed build also passed reduced-motion browser check: 19° stays at 0°, 80° maps to 72°, release settles immediately to 90°.

## 2026-10-22 — Increase rotation sensitivity by 20%

- Apply a 1.2 multiplier to rotation deltas after consuming the unchanged 20° finger intent threshold. Reverse rotation uses the same multiplier; pan/zoom and release-only snapping within 20° remain unchanged.

## 2026-10-22 — Snap only after rotation release

- Removed magnetic distortion during active two-finger rotation: after the existing 20° intent threshold, map rotation follows finger deltas 1:1, including reversals. Removed the unused magnetic helper and activation ramp.
- Kept the 20° release snap range and cancellable 220ms ease-out to the nearest right angle. Pan/zoom and reduced-motion behavior are preserved.

- Validation: build, lint/FSD and diff checks passed. Synthetic browser touch gestures: finger angles 19/25/35/30/92° produce map angles 0/5/15/10/72°, confirming direct tracking and reversal after consuming the threshold; release settles to 90°.

## 2026-10-22 — Intentional rotation and wider smooth snapping

- Require 20° accumulated two-finger rotation before activating rotation. Consume the threshold so crossing it does not jump the map; pan and zoom remain available immediately. Gestures that never activate rotation do not snap on release.
- Widen right-angle magnetic attraction to 20°. Ease its activation over the first 5° of applied rotation to avoid jumps when starting from a non-cardinal angle; preserve raw angle tracking for escape/reversal. Release settles over 220ms ease-out, respecting reduced motion and interruption.

- Validation: pnpm build and pnpm lint passed. Synthetic browser gestures preserved 0° through a 20° finger turn, applied 0.10° at 20.1° without a jump, and settled from 72.54° to 90°. A 19° gesture starting at 45° preserved 45° after release.

## 2026-10-22 — Responsive map rotation and right-angle magnets

- Added a web-only MapGestureController in the floor-map slice. A capture listener on the stage wrapper handles two-finger pan/zoom/rotation before the upstream 30° rotation threshold; the packaged library remains unchanged.
- Rotation starts from touchstart with atan2 and normalized angle deltas. Stable touch IDs avoid finger-order flips; inverse transforms preserve the world point under the moving pinch center. Existing scale limits and the stage's public dragBoundFunc remain enforced.
- Right angles attract smoothly within 5° (0.65° quiet core), using a separate raw gesture angle so the magnet cannot lock rotation. Release settles to the nearest quadrant over 140ms; new touch/mouse/wheel cancels the settle, reduced motion applies it immediately. Touchend still reaches the library to preserve two-to-one-finger panning.

- Validation: pnpm lint (including FSD checks), pnpm build, and git diff --check passed. Browser synthetic two-touch gestures on the production GUK map: 15°/45° follow directly, 88° attracts to 89.54° and releases to 90°; crossing +179° to -179° stays continuous, simultaneous 1.2× pinch zoom works, and a free 122° angle remains unsnapped. Physical phone feel still needs user verification.

## 2026-10-22 — Open floor 1 by default

- Added shared building helper defaultFloor: numeric floor 1 is preferred over basement/ground floors; when absent, the existing lowest-floor ordering is used. Empty lists remain safe.
- Ordinary institute entry and intent prefetch use the same helper. Explicit route-point floors and subsequent manual/GPS behavior are retained.

## 2026-10-22 — Align GPS with Route

- Moved the institute GPS control into the persistent navigator actions row, immediately before Route, with an 8px gap on mobile and desktop. Removed its separate bottom-right page positioning.
- GPS is now 40×40px, matching Route height, radius/background/shadow and borderless treatment; the active location state and accessible toggle label are retained. It follows panel movement/visibility with Route and keeps its map-interaction collapse/restore behavior.

## 2026-10-22 — Match map and panel surfaces

- Light background token is now #F4F5F7. The floor map resolves that same --background token when drawing instead of keeping a separate light/dark surface palette; dark mode therefore matches the existing #0F1115 panel background too. Pattern ink/opacity is unchanged.

## 2026-10-22 — Approved dots and lines map background

- Added `widgets/floor-map/ui/FloorMapBackground` inside the existing Konva floor layer. It renders the approved mixed pattern (1.6px dots at 12% opacity, major lines every five dots at 5.4%) with light #f4f5f7 and dark #13171d surfaces.
- The pattern follows the floor stage translation/rotation/zoom. Power-of-two world spacing keeps visible density near 24px without generating excessive tiny dots; dot radius and line width remain stable in screen pixels.
- Theme validation also fixed startup hydration: the synchronous theme effect now reads the saved preference before writing it, so a saved dark theme survives reload.
- Only the visible world bounds are drawn, using one non-listening Shape and batched canvas paths. It is ordered above the library's optional building background and below rooms, routes and markers. No dependency/vendor changes or extra network assets.

## 2026-10-22 — Background settings preload

- Settings stays out of initial route JS, but now loads automatically in idle time after the main screen data/map are ready and the document load event has completed. It no longer normally waits for the first Settings click.
- `viewer.pageReady` is reset per route and published by campus map/data or resolved floor content. SettingsLayer schedules/cancels idle work accordingly; save-data skips speculative loading. Explicit opening still works immediately through its existing lazy/skeleton path.
- Background completion mounts the closed, loaded dialog so subsequent opening avoids a new Suspense wait. Background failure does not change visible UI or remove the normal open path.

## 2026-10-22 — Loading priorities and browser locale selection

- Resolved initial translations before mounting the application (shared i18nReady promise, AppLoading startup placeholder), avoiding the app-wide Suspense fallback delay. Added Golos font preload.
- Deferred settings, search results, and Route body code. Preserved dialog exit/close behavior with a first-use loading fallback. Building photos outside the carousel viewport defer their actual src; scrolling reveals them without changing card geometry.
- App-layer intent prefetch loads the destination institute chunk and its likely floor on hover, focus, or touch, respecting save-data. No bulk startup prefetch.
- Explicit language order: saved manual selection → navigator.languages (regional locales normalized to supported base language) → Russian. Read local locale JSON files; update html lang. Automatically detected language is not persisted as a manual override.
- Production before/after medians, environment limits, raw samples and language checks: `performance/2026-10-22-loading.md`. Lint/FSD and production build passed.

## 2026-10-22 — Shared slow loading skeletons

- Added shared Skeleton, ListSkeleton, and MapSkeleton compositions with a 3.2s shimmer, theme tokens, loading status labels, and static reduced-motion rendering.
- Applied them to initial app/route Suspense, campus map initialization, institute data, floor resolution, building cards, search (including pagination without removing existing results), and point details fetching. Error and empty-result messages stay distinct; no artificial delays were added.
- Campus placeholders follow the actual map onLoad/onError lifecycle; floor placeholders use existing data resolution. Settings and Route forms have no data loading of their own and remain immediately available.

## 2026-10-22 — Circular theme reveal

- Theme selection now reveals the entire new palette as a 450ms ease-out circle originating at the selected button center, using the native View Transition snapshot of the whole document (including the settings portal).
- Theme class/local storage updates run in a layout effect so the new snapshot captures the complete palette. Color transitions are disabled during snapshot/reveal; removed the independent body color transition.
- `features/change-theme/model/useThemeTransition` owns only the visual transition; Redux remains the theme source. Rapid choices skip the preceding transition, and unmount cleans it up. Unsupported browsers and reduced-motion preferences receive an immediate synchronized theme change.

## 2026-10-22 — Separate settings overlay

- Settings is now a controlled Radix Dialog in a sibling portal above the persistent navigator. Redux `settingsOpen` is independent of content/history; removed Settings from the navigator content enum and the temporary outgoing-content workaround.
- `SettingsOverlay` reuses the existing SettingsPanel and exact header assets. It has its own 180ms ease-out enter/exit animation, downward touch dismissal, close button, Escape handling, focus trap/restore, and transparent outside-click backdrop. Lower panel content, snap height, carousel scroll, and DOM identity are preserved.
- `useSettingsSwipe` owns only overlay gesture geometry. Settings closes on navigation; opening cancels pending map restoration. Combined panel-expanded selector also hides map controls while settings is open. Search and Route remain in the primary navigator.

## 2026-10-22 — Preserve settings during close animation

- Settings retains its outgoing header/body while the mobile panel animates back to the base height. The campus carousel no longer mounts at the expanded height and plays its own morph during settings closure.
- Restored base content appears only after settling; reduced-motion/immediate transitions switch immediately. Re-grabbing the drawer releases the outgoing presentation so manual input can take over. Map controls stay hidden until the closing transition finishes.

## 2026-10-22 — Settings heading size

- Reduced the mobile Settings heading from 16px to 14px; retained its centered alignment and 16px line height.

## 2026-10-22 — Settings redesign (Figma 2699:1620)

- Replaced the collapsed additional-settings disclosure with four visible sections: language, two-button light/dark theme control, social links (VK, Telegram), and feedback/privacy links. Existing Redux theme updates, i18next selection, feedback language URLs, and legal PDF are retained.
- Settings now has an 80px mobile header with centered title, exact 24×4 handle and 20×20 close icon. Rows are 47px with .5px borders and 4% soft shadows. Language labels stay centered independently of flag/native-name widths.
- Imported exact external-link icon as `public/remake/5c1d5.svg` at 12×12. The footer uses existing Ruda and Yandex terms link. Body remains scrollable on short screens.
- Added section/link translations for all four supported languages. Shared shadcn primitives remain unchanged; composition stays within existing FSD slices.

## 2026-10-22 — Route action interrupts drawer swipe

- A content change now relinquishes the active touch gesture, clears dragging/ghost-click state, and lets the new content animate to its target. Releasing an older swipe cannot reset Route to an intermediate height.
- Base height is saved from the previous resting target rather than the in-flight finger position, so closing Route returns to a valid snap position.
- Touch starts outside the draggable surface (including Route/Campus actions) or a second finger no longer discard an active gesture before their target is checked.

## 2026-10-22 — Building card shadow

- Building card shadows now use 4% black opacity in normal and hover states. Other shared shadows are unchanged.

## 2026-10-22 — Restore panel after map interaction

- Mobile map-driven collapse saves the preceding content, target height, and base drawer state. It restores them with the existing ease-out driver after 1500ms of idle time.
- Pointer/touch holds block the timer until release/cancel; repeated map input restarts it. A panel already collapsed manually is never registered for automatic restoration.
- Panel input, navigation, switching out of mobile layout, and unmount cancel the saved restoration/timer. The shared panel remains mounted across routes.

## 2026-10-22 — Persistent panel transition fixes

- Fixed invisible campus cards after returning from a collapsed institute panel: the carousel was measured while its body had `display:none`, setting every compact card opacity to zero. `useBuildingCardMorph` now observes list size and recalculates visible cards/scroll origin when it becomes visible without requiring progress or data changes.
- The normal institute panel (`Empty`, showing QuickTypes) now rests at 244px like the campus panel. The 80px search-only state remains available through an explicit collapse or map interaction.

## 2026-10-22 — Persistent navigation panel

- `app/router/NavigatorLayout` owns the single SideMenu instance shared by campus and institute routes. Only the Outlet changes; page loading is suspended inside the layout without hiding/remounting the panel.
- Removed page-owned SideMenu instances, including the institute map-loading dependency. Existing page effects continue selecting campus/building content and drawer height.
- SideMenu and point-search resolve the active institute with `useMatch('/institute/:intstName')` because the shared parent route has no child route params. This preserves building labels and search scope.

## 2026-10-22 — Restore building photographs; defer SVG presentation

- Restored GUK (`ecb85.png`) and IRIT-RTF (`2a558.png`, original `photo-irit` crop) in the building catalog.
- SVG presentation is inactive: neither catalog entry declares `illustration`. Preserved `BuildingIllustration`, the optional metadata field, rendering branch, both SVG assets, and all progress-driven clipping/gradient styles for future work.
- To resume SVG presentation, set the corresponding entry's `illustration` to `guk` or `irit-rtf` and its file to the matching SVG. No active vector facade is currently rendered; drawer/card animation remains intact.

## 2026-10-21 — IRIT-RTF SVG facade

- Imported exact `9c8cc.svg` from Figma frame `2883:6817` as `public/remake/irit-rtf.svg` (162.061×56.4403). Replaces only the IRIT-RTF photograph.
- Generalized the private GUK component to `entities/building/ui/BuildingIllustration`. Each building still uses one original SVG. IRIT stays vertically centered in the 100px slot with left offset −30.99px; its clip grows from 100px to 140px continuously with drawer progress.
- IRIT gradient stops interpolate 50%→14% and 100%→28%, with right white opacity .8→.9. GUK behavior is preserved. Text remains above both illustrations.

## 2026-10-21 — GUK SVG facade

- Replaced the GUK photograph with one local SVG (`public/remake/guk.svg`), the exact wide facade exported from Figma section `2884:8546`, frame `2883:6817`.
- Private `entities/building/ui/GukIllustration` renders one image at its intrinsic 360.938×100 size. The card clips it to 100×100 when compact and progressively reveals the wings as it widens. Paths remain unchanged and the facade is never stretched or crossfaded with a second export.
- The inherited continuous `--campus-progress` adjusts the white gradient (transparent stop 50%→14%, white stop 100%→28%). Text stays above the artwork. Direct dragging, reverse swipes, and release settling share the same progress.
- Removed the redundant compact SVG and both opacity layers. Other building photos are unchanged.

## 2026-10-21 - Continuous gesture-driven campus morph

- Replaced endpoint-only FLIP/Web Animations with one continuous progress derived from drawer height
  between 244px and 90% layout height. It updates during touchmove, including reversal and pauses.
- Card width/height/radius, row positions, label trajectories/fades, staggered incoming cards and
  description opacity/translation all derive from progress. Photos stay 100x100 without cloned layers.
- Menu/Close icons rotate and crossfade with progress; map actions fade/shift out. Compact cards fade
  in/out between the 80px and 244px states. Horizontal carousel origin survives expansion/collapse.
- One requestAnimationFrame height driver completes release/button transitions (260ms cubic ease-out,
  180ms between compact states), can be interrupted by a new touch, and skips settling for reduced motion.
- Removed CSS height interpolation so panel geometry and card progress cannot run on separate clocks.
  Clamp initial frame time to zero to prevent a backwards frame when a frame timestamp predates start.
- Longer gestures can traverse all home states; short directional swipes still select the next state.
- Validation: pnpm lint/build; browser samples at multiple drag positions, hold and reversal, card/photo
  geometry, staged opacity, endpoint layout and release interpolation. Re-grab froze at 507.3px; reversing
  moved to 407.3px; release never moved backward; a 216px carousel offset restored after the full cycle.
  Native-device testing remains external.

## 2026-10-21 - Expanded campus cards, Figma 2877:2911

- Figma access recovered; obtained high-fidelity design context and screenshot for 2877:2911.
- Added Redux sidebar content ExpandedInstitutes: home now has 80px search-only, 244px carousel,
  and a 90% detailed building list. Short upward swipes step through these states; downward swipes
  reverse them. The handle opens the detailed list from the carousel; Close returns to the carousel.
- Detailed cards match the design: 100x100 photo, 100px row height, full available width, 8px gaps,
  12px type and 16px horizontal / 12px vertical details padding. The header keeps a search trigger,
  so opening the list does not summon the keyboard. Search swiping back restores the detailed list.
- Native Web Animations morph the existing link/photo nodes between layouts in 240ms ease-out,
  with title movement and detail fade-in. No animation dependency or image clones; reduced-motion
  bypasses the morph. Horizontal carousel scroll is restored on collapse.
- Reused exact local photos/search/close assets and downloaded 3a06c.svg (24x4 handle) from Figma.
- Added full names/addresses present in the design for GUK, IRIT-RTF and FTI. API still supplies
  six actual buildings, without FTI; other rows use server names and omit unavailable addresses.
  No building is fabricated just to reproduce the three design sample rows.
- Validation: pnpm lint/build; 393x852 browser comparison, real links and 100x100 photo geometry,
  same-node forward/reverse animations, short swipes, focus suppression and search/list return.

## 2026-10-21 - Short swipes, search return state and Safari-sized input

- Vertical drags of 32px commit a state transition instead of requiring half the screen height.
- A tall search/settings/route panel returns to its saved base content and resting height (e.g.
  campus search + buildings at 244px); another downward swipe collapses to the 80px search row.
- Upward swipe on the compact row restores the 244px base panel without entering search.
- Defer search activation for inactive inputs/buttons until touchend confirms a tap. Vertical
  gestures cancel touch defaults and suppress the compatibility click; taps still activate search.
- Start drag geometry from the rendered panel height, including when a settling animation is active.
- Search input uses computed 16px font and scale(0.875), with compensated width/height in a clipped
  frame: placeholder and typed text remain visually 14px without Safari focus zoom.
- Validation: browser reproduction of focus, blur, short collapse, compact collapse and upward
  restore, including a retargeted compatibility click, horizontal cards and deliberate search tap.
  pnpm lint/build; actual Safari keyboard behavior still needs confirmation on a physical device.

## 2026-10-21 - Keep map and expanded panel geometry fixed across keyboard changes

- Keep the pre-keyboard layout height in Redux and `--viewport-height` while an editable control
  is focused and either window or VisualViewport height shrinks. Hold it through keyboard dismissal.
- Window-width changes reset the layout baseline for orientation/window resizing.
- VisualViewport height is tracked separately as `--visible-viewport-height`; only the scrollable
  panel body shrinks above the keyboard. Panel bounds, header position and map dimensions stay fixed.
- No keyboard-driven Yandex map resize/recentering on the home page. Search font remains 16px on mobile.
- Validation: browser simulation of visual-only keyboard resize and progressive Android-style window
  resize (852 down to 462px and back). Map stayed 852px; panel stayed 766.8px at y=85.2px throughout.
  Panel body ended at the keyboard edge; pnpm lint/build pass. Physical device testing remains external.

## 2026-10-21 - Drawer ceiling clamp and map control visibility

- Mobile panel has a 90% parent-height ceiling at every animation frame, including keyboard resize.
- Settled expanded panels use a percentage height; content and viewport changes synchronize in layout effects
  before paint, avoiding the old full-size pixel height while the keyboard shrinks the viewport.
- Viewport reconciliation no longer overrides the initial collapsed institute panel.
- Sidebar Redux exposes panelExpanded; the institute page hides all secondary map UI (floors, GPS,
  building redirects and point details) while a tall mobile panel is open, restoring it on collapse.
- Desktop map controls remain visible. Short campus-card panels retain map controls.
- Validation: pnpm lint/build and browser frame sampling during simulated keyboard resize, plus control
  visibility on expand/collapse. A physical smartphone is still required for device-specific confirmation.

## 2026-10-21 - Mobile keyboard viewport fix

- Removed keyboard-height bottom offsets that pushed a full-height drawer above the screen.
- App root and Redux screen height now track the visible VisualViewport height and offsetTop.
- Window resize and VisualViewport resize/scroll share one update path, avoiding double keyboard compensation.
- Expanded drawers resize to the available height; collapsed drawers stay collapsed when the keyboard opens/closes.
- Mobile search uses 16px input text to prevent Safari focus zoom; point details are capped to the visible root.
- Validation: pnpm lint/build; browser simulation of 852px to 480px keyboard viewport, a panned viewport,
  keyboard close and collapsed-state preservation. Physical smartphone keyboard was not available in this check.

## 2026-10-21 - REMAKE and frontend rule alignment

- Ported the Figma REMAKE layout, local assets/fonts, mobile cards, language settings and route panel.
- Added panel-wide gestures, collapse-to-search in every mobile state, map-triggered collapse and 180ms ease-out settling.
- Public slice exports now expose `SearchHistory` and `buildingPhoto`; consumers no longer deep-import them.
- Recent places are Redux state; feature-owned RTK listener middleware persists them, storage helpers live in `lib/`.
- REMAKE selectors compose Tailwind utilities with `@apply`; generated shadcn primitives remain unchanged.
- Added `pnpm check:fsd` to `pnpm lint` and corrected browser globals in ESLint flat config.
- Documented components, tokens, pages, transitions, API proxy and local renderer dependency.
- Validation: `pnpm lint`, `pnpm build`, mobile browser checks for search/history and panel behavior.

## 2026-10-06 — Floor map icons from local files

- Shape `icon` filenames load from `src/shared/assets/icons/floor/` via `floorIconSrc`.
- `RoomIcon` no longer calls `GET /api/icons`, which serves building icons.
- Unknown filenames still fall back to `shared/assets/icons/map/placeholder.svg`.

## 2026-10-05 — Floor loading skeleton

- `useFloorData` reads RTK Query `currentData`, so a floor change no longer keeps the previous floor's rooms on the canvas.
- While the selected floor is not resolved, `FloorMap` renders `FloorMapSkeleton` instead of the Konva stage.

## 2026-10-05 — Move to shadcn/Tailwind and finish FSD

- Replaced all SCSS modules, `normalize.css` and `style.css` with Tailwind
  utilities and a single token stylesheet (`src/app/styles/index.css`).
- Old custom UI kit (`Button`, `IconButton`, `Panel`, `TextInput`, `XSign`,
  `classNames`) replaced by shadcn `Button`/`Input`/`Switch`/`Separator`,
  `Panel`, `DragHandle` and lucide icons.
- Removed flat directories (`src/components`, `src/utils`, `src/store`,
  `src/shared/hooks`, legacy `src/features/*`) and re-homed code into FSD
  slices (see `architecture.md`).
- Single RTK Query `baseApi` in `shared/api`; entities inject their endpoints.
- `MapUi` widget (which imported other widgets) was removed; the institute page
  composes the widgets/features directly.
- Search query state (name/type per direction, active direction) moved from
  `useState` + prop drilling into `features/point-search` Redux slice. Typing in
  the search field now clears a previously selected quick type.
- `@/*` alias now points at `src/` (was the repo root); `baseUrl` removed for TS 6.
- `useDrawer` sorts break points numerically (was lexicographic).
- Removed the no-op institutes-list touch handler (it set `bottom` on a
  statically positioned element).
- Dependencies: removed `cn`, `sass`, `vite-plugin-svgr`, `vite-tsconfig-paths`,
  `stylelint*`; added `clsx`, `tailwind-merge`.
- ESLint: react version pinned (`eslint-plugin-react` cannot auto-detect under
  ESLint 10), `max-len` ignores strings, shadcn files exempt from style rules.
- Legacy files were moved to `legacy-src-backup/` (not deleted) for review.

## 2026-10-22 — Refresh development server after local library update

- Restarted the existing web Vite process on port 3000; its optimized dependency cache still contained the old floor-plan package. The new process detected the changed lockfile and regenerated dependencies. No application source changed.
- Verified HTTP responses from :3000: FloorMap passes public rotation settings, and the optimized library includes rotationSensitivity and dots-and-lines. Preview :4174 remains separate and serves dist.

## 2026-10-22 — Enable adaptive map labels/icons from library 1.2.0

Repository: UrfuNavigator-web; paired source changes: konva-floor-plan (feat/map-label-rotation).

- FloorMap passes stable public annotations options: text screen font 9–16px, fade 4–8px; icon larger dimension 16–26px, fade 8–16px. Normal text/icons stay upright; library's directional exceptions rotate with the map. No per-frame React state or injected canvas mutations in web.
- Updated local package to 1.2.0, which also fixes three-to-two finger freezing and layout offsets overwritten by release settling. Active gesture parameters stay 20°/1.2/20°/220ms.
- Library regression tests, build/typecheck and web build/lint/FSD passed. Native browser inspection was stopped by computer-use policy because the current URL could not be determined reliably; no physical phone or browser visual result is claimed.

- Final delivery validation: new local 1.2.0 package installed, web build/lint/FSD passed; dev :3000 forced dependency re-optimization and HTTP module responses include annotations/keepUpright/beforeDraw; preview :4174 serves the new annotation bundle byte-for-byte from dist.

## 2026-10-22 — Golos UI Regular map labels

- Repositories: konva-floor-plan and UrfuNavigator-web. Library 1.2.1 adds optional annotation text fontFamily/fontStyle/color; omission preserves authored scheme text and Roboto 500 defaults. Web configures Golos UI, normal (400), #60636C. Existing local Golos UI font face and preload are reused. Icon styling and label size/rotation behavior are retained.

## 2026-10-22 — Mobile double-tap zoom

- Repositories: konva-floor-plan (feat/map-label-rotation) and UrfuNavigator-web. Library 1.3.0 owns the native recognizer and animation; web configures doubleTapScale=2 and doubleTapDuration=220ms.
- Two short one-finger taps within 300ms and 24px zoom around the second tap; holds over 250ms, movement beyond 12px, cancellation and any multitouch invalidate the pair. The listener lives on the stage wrapper so it observes pinch starts before rotation's capture interception.
- Cubic ease-out preserves the tapped world point subject to map bounds; scale remains within 0.09–6. New touch, mouse, wheel, layout change or unmount cancels animation. Reduced motion/zero duration is immediate; doubleTapScale=1 disables zoom. Existing room tap selection is not delayed or suppressed.
- Fifteen library tests pass, including rotated anchor preservation, exclusion of pan/hold/pinch/distant/late taps, interruption, max zoom and disabling. No physical-device/browser visual test is claimed.

- Delivery checks: library build/typecheck and 15 tests passed; web build/lint/FSD passed. Dev :3000 restarted with forced dependency optimization and HTTP responses expose double-tap config; preview :4174 serves the matching new bundle from dist.

## 2026-10-22 — Map quick zoom: double tap, hold, vertical drag

- Repositories: konva-floor-plan (feat/map-label-rotation), UrfuNavigator-web (local package 1.3.1).
- Second touch is armed when its start is within 300ms/24px of the first tap. Keep holding and move vertically >6px: down zooms in, up zooms out, with 160 CSS pixels per doubling and a fixed world anchor at the second tap. The activated gesture can be held arbitrarily long and does not run an extra discrete zoom on release.
- Armed vertical moves are consumed before pan; touchend still reaches gesture rebasing. Consumed gesture end events do not select rooms/services/graph points or clear editor selection. Horizontal swipes, ordinary single-finger pan and multi-touch stay available; an extra finger cancels quick zoom. Existing short double tap still zooms 2x.
- Eighteen tests pass, including continuous reversal on a rotated map, no pan during quick zoom, release without a jump, handover to multi-touch and min/max scale limits. Physical phone feel is not verified.

- Final delivery: library build/typecheck and 18 tests passed; web build/lint/FSD passed. Dev :3000 restarted with dependency re-optimization and serves quick zoom; preview :4174 serves the matching updated bundle.

## 2026-10-22 — Quick zoom on empty map background

- Repositories: konva-floor-plan (feat/map-label-rotation), UrfuNavigator-web (package 1.3.2).
- Native wrapper touchstart now prevents default across the whole map with a non-passive listener. Konva only did this on listening shapes, allowing compatibility mouse events after empty-stage taps to clear recognition. The recognizer now also ignores touch-generated mousedown (sourceCapabilities.firesTouchEvents); real mouse input still cancels.
- Added regressions for hit-test-independent touch handling, compatibility mouse events and real mouse cancellation. Actual physical phone verification remains pending.

- Validation: 20 library tests and library build/typecheck passed; web build/lint/FSD passed. Dev :3000 restarted and serves the compatibility-mouse fix; preview :4174 matches the new compiled bundle.

## 2026-10-22 — Cancel room descriptions when touch becomes a map gesture

- Repositories: konva-floor-plan (feat/map-label-rotation), UrfuNavigator-web (package 1.3.3).
- View-only onRoomSelect from touchend is deferred for 320ms, beyond the 300ms double-tap recognition interval. Any new touch, movement, cancel, wheel, real mouse input, layout change or unmount cancels the pending room callback. Mouse clicks remain immediate and the public onRoomSelect signature is retained.
- The gesture recognizer marks invalid drag/hold/multi-touch ends as consumed; these events still propagate for pan/pinch rebasing but cannot select rooms. The second tap/quick-zoom end is already consumed. Editor's ordinary selection remains immediate.
- Added deferred-selection regressions: delayed single tap, immediate click, ignored consumed end, cancellation by second touch/motion/pinch/cancel/wheel/unmount. All 22 tests and library build/typecheck pass. No physical-phone result is claimed.

- Delivery: library build/typecheck and 22 tests passed; web build/lint/FSD passed. Dev :3000 restarted and serves deferred selection; preview :4174 serves the matching updated bundle.

## 2026-10-22 — Phone direction needle above GPS

- Repositories: UrfuNavigator-web and konva-floor-plan (feat/map-label-rotation, packed 1.4.0).
- Added a 30×36px faceted red/gray needle in a 40px non-interactive slot, 8px above GPS. No button background, outline, border or circle. It follows the navigator actions row and its expansion visibility. PhoneDirection labels are localized in ru/en/zh/ar.
- GPS click is the permission activation point. iOS requestPermission(true) is invoked only on that user action; secure browsers without the permission method can listen when GPS is enabled. No automatic prompt on page load, no location/heading persistence or network transfer added.
- Accept webkitCompassHeading with valid accuracy, otherwise absolute alpha/beta/gamma. Relative orientation and invalid readings are ignored; unreliable absolute readings hide the needle. Screen orientation and a near-vertical rear-normal fallback are accounted for. A circular low-pass filter avoids 359°/1° spins, stops its rAF when settled, respects reduced motion and removes listeners on GPS disable/unmount/visibility changes.
- Calibrated north is derived by projecting a small geographic north step through the floor's existing coordinate predictor at the building reference position, using floor altitude. Unknown/degenerate calibration hides the needle. Geolocation movement heading is not used as a compass.
- The library's onRotationChange writes --floor-map-rotation directly; calibrated --floor-map-north and visibility are set/reset by FloorMap. The needle combines those with its local --phone-compass-heading. This is ephemeral drawing state, avoiding Redux/React updates on every rotation frame.
- Six compass tests cover cardinal/screen orientation, vertical posture, relative/invalid data, WebKit accuracy, wraparound, floor north, secure context and explicit grant/deny/error paths. Library observer tests also pass. Physical-phone sensor behavior and native visual rendering remain unverified.
- Secure context/user-activation references: https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientationEvent/requestPermission_static ; orientation math/frame: https://www.w3.org/TR/orientation-event/ . LAN HTTP does not enable compass sensors; trusted HTTPS is required on a phone. Existing HTTP dev/preview endpoints are retained.

- Delivery validation: 23 library tests plus 6 web compass tests passed; both builds/typechecks and web lint/FSD passed. Dev :3000 serves the needle and new rotation callback, preview :4174 matches compiled bundles; compass visibility CSS is present. Actual sensor and native permission UI remain unverified; phone access requires trusted HTTPS.

## 2026-10-22 — Widen web release snap range to 25°

- Repository: UrfuNavigator-web. FloorMap passes rotationSnapRange=25; activation threshold stays 20°, sensitivity 1.2 and settle duration 220ms. Library defaults stay consumer-neutral at 20°.
- Repository: konva-floor-plan. Added an actual-hook regression for the ±25° web override at every right angle, checking inclusion of the boundary and rejection just outside it.


## 2026-10-22 — Document map overrides explicitly

- Documentation only: recorded admin scheme fields superseded by rendering options, precedence, theme scope, source locations and restoration steps. Distinguished options without admin fields from actual palette overrides.
- Documented that removing only background.color or disabling the pattern does not restore the scheme background; the entire background prop must be omitted. Linked the web registry and library contract, and required future overrides to update these records.
- No runtime changes; local package/build unchanged.


## 2026-10-22 — Relative annotation fade threshold

- Added optional annotations.text/icons.fadeThresholdMultiplier in konva-floor-plan: positive finite values multiply both fade thresholds; omitted/invalid values use 1. Size bounds are unchanged.
- UrfuNavigator-web sets text multiplier 0.5: fade 2–4px instead of 4–8px. Icons remain at multiplier 1 (8–16px). No admin fields are replaced by this option.
- Validation: 27 library tests passed; library/web builds and web lint/FSD passed. Updated local vendor archive and lockfile integrity.


## 2026-10-22 — Lower text fade multiplier to 0.2

- UrfuNavigator-web: annotations.text.fadeThresholdMultiplier is now 0.2, giving effective fade thresholds 0.8–1.6px. Text size and icon settings are unchanged. Updated current override documentation; library runtime/defaults and vendor archive are unchanged.


## 2026-10-22 — Avoid stale local renderer optimization

- Verified :3000 served an optimized renderer without fadeThresholdMultiplier despite current source/install. Excluded the local renderer tarball from Vite dependency optimization so development serves its current ESM directly.
- At minimum gesture zoom 0.09 and authored text size 24, projected text size is 2.16px. Multiplier 0.2 has full opacity above 1.6px, so labels remain fully visible throughout the clamped gesture zoom range. Initial fit can be below that clamp.


## 2026-10-22 — Restore text fade multiplier to 0.5

- UrfuNavigator-web sets annotations.text.fadeThresholdMultiplier back to 0.5 (effective 2–4px). Updated current policy documentation; icons and library defaults remain unchanged. Retained the local dependency cache fix.


## 2026-10-22 — Fix blank building page in development

- Reproduced browser SyntaxError: React jsx-runtime had no named jsxs export after excluding the local renderer from optimization. Supersedes the previous exclusion workaround.
- Explicitly prebundle the renderer and force dependency optimization on server startup/config restart. This preserves React CommonJS interop and refreshes the local tarball. After replacing a vendor tarball, refresh lockfile/install and restart the development server.
- Browser verification: GUK first-floor canvas, labels, floor selector and panel render at :3000 after reload. Text multiplier remains 0.5. Library source unchanged.


## 2026-10-22 — Set text fade multiplier to 0.75

- UrfuNavigator-web sets annotations.text.fadeThresholdMultiplier to 0.75 (effective 3–6px). Updated current policy documentation; text size, icons and library defaults are unchanged.


## 2026-10-22 — Separate room browsing from route endpoint search

- Ordinary SearchTrigger now enters a dedicated browse query, clears route endpoints and stale room details, and always displays a search placeholder instead of a route endpoint name. Route from/to queries remain separate.
- useSelectPoint in browse mode clears route state, selects the room for its description, sets the floor and navigates to the building, returning the main panel to Empty. Route endpoint selection still updates only its requested endpoint and preserves the other. History shares the same selection path.
- Categories opened from the base panel enter browse mode and clear the route. Categories inside an existing endpoint search preserve its target.
- Validation: three regression tests execute the real search reducer and selection hook for browse/from/to. Build and lint/FSD passed. Repository: UrfuNavigator-web; no library changes.


## 2026-10-22 — Remove duplicate search cross

- UrfuNavigator-web: SearchBar suppresses the browser-native search cancel/decorative control locally, retaining the single explicit close button on the right. Search semantics, keyboard and query behavior remain unchanged. Shared Input is unchanged.


## 2026-10-22 — Type-only category search

- All category queries now use /api/points with type, without sending the translated category name as a name filter. Building/floor context remains an exact filter for category listings. Free-text search continues to use /api/search; editing the category label already clears its type in pointSearchSlice.
- The existing points API supports length but no offset. Category pagination fetches the required prefix (offset + length) and returns only the requested slice, normalizing null to an empty list. This prevents repeated pages; deep category pagination transfers progressively larger prefixes. No API repository changes.
- Validation: four search regression tests passed, covering browse/from/to and generic category request/pagination; web build and lint/FSD passed. Repository: UrfuNavigator-web.


## 2026-10-22 — Desktop settings handle and theme double-click

- Hide the settings swipe handle above 1200px and attach swipe listeners only at phone widths. Reset drag offset when crossing the breakpoint.
- Theme view-transition snapshots ignore pointer events. SettingsOverlay prevents Radix outside-interaction dismissal while theme-transition is active: snapshot retargeting previously closed the dialog on the second click. Normal backdrop/close dismissal remains available outside the reveal.
- Browser reproduced the original close, then verified light-to-dark and dark-to-light double-clicks retain the open desktop settings. Desktop handle is absent from the accessibility tree.
- Kept the existing Yandex 2.1 runtime dependency available while API 3 migration awaits a configured key.


## 2026-10-22 — Disable page text selection

- UrfuNavigator-web: global user-select none (including WebKit) applies to page and portal content. Inputs, textareas and editable content retain native selection for editing. Links/buttons continue to work.


## 2026-10-22 — Desktop settings close button only

- Above 1200px, SettingsOverlay prevents outside-interaction and Escape dismissal; its close button remains functional. The lazy-loading backdrop also ignores desktop clicks. Mobile dismissal behavior and navigation lifecycle cleanup remain unchanged.


## 2026-10-22 — Expanded desktop building list

- UrfuNavigator-web: InstitutesList uses progress 1 above 1200px, including loading placeholders. Desktop displays one full-width 100px-tall row per building, with the existing photo, title, full name and address matching the expanded mobile cards. Mobile swipe/morph remains unchanged.


## 2026-10-22 — Restore admin building icons

- UrfuNavigator-web: BuildingLink now renders building.icon.url for every building, replacing the local photographic/illustration source override. Removed photo-specific crop classes and use contain to preserve SVG proportions. Layouts and label/address/order metadata are unchanged. Preserved dormant illustration/photo assets.
- Image component remounts when its signed URL changes to reset loading state. Updated override registry.


## 2026-10-22 — Reduce building icon size

- UrfuNavigator-web: admin building icons occupy 75% of the existing 100px square, centered with 12.5% insets. Card layouts remain unchanged; SVG aspect ratios are preserved.


## 2026-10-22 — Expand mobile drawer for all categories

- UrfuNavigator-web: opening All categories from the building base panel enters the Categories sidebar state and animates to the existing 90% height. It does not focus a search input or open the keyboard. Fewer categories returns to the base panel. Existing full-height search category views and desktop toggles retain their behavior.
- Categories participates in expanded controls visibility and drawer swipe/base restoration.


## 2026-10-22 — Match category and building card shadows

- UrfuNavigator-web: category cards now use the building card shadow: 0 0 10px black at 4%; hover uses 0 2px 14px black at 4%. Applies across themes and viewport sizes.


## 2026-10-22 — Distribute expanded category columns

- UrfuNavigator-web: all-categories uses a responsive grid of fixed 100px columns with minimum 8px gaps and space-between distribution. Extra width increases inter-column spacing until another full card plus its minimum gap fits. Incomplete final rows align with the same columns. Compact carousel remains unchanged.


## 2026-10-22 — Stretch expanded category cards instead of gaps

- UrfuNavigator-web: expanded categories now use equal flexible columns with a 100px minimum (capped to available width for narrow containers) and fixed 8px gaps. Cards and the all/fewer toggle fill the column; height stays 132px. Supersedes the previous space-between layout. Compact carousel is unchanged.


## 2026-10-22 — Pull past category carousel end

- UrfuNavigator-web: mobile compact category carousel supports a horizontal end pull. Native scrolling reaches the end first; then 72px further leftward finger movement fills the arrow ring. Release after reaching the threshold opens all categories through the existing toggle, expanding the base drawer.
- Short/reversed pulls, vertical gestures, touchcancel and multi-touch do not open the catalog. Claimed pulls suppress synthetic clicks to prevent accidental category selection or immediate closing. Existing button click and desktop behavior remain unchanged.
- Regression tests execute the actual hook listeners for threshold/release, native scroll versus pull, reversal, cancellation, axis selection, multi-touch and cleanup. Physical phone feel remains to be checked.


## 2026-10-22 — Elastic category end-pull return

- UrfuNavigator-web: compact mobile category list shifts left with a damped pull (about 21px at the opening threshold). Ring and list share progress. Incomplete/cancelled pulls now return over 260ms cubic ease-out instead of instantly resetting the indicator. Reduced motion resets immediately.
- New gestures and unmount cancel return frames; completed pulls still open through the existing toggle. Regression covers gradual return and interruption.


## 2026-10-22 — Halve category end-pull sensitivity

- UrfuNavigator-web: end-pull threshold increased from 72px to 144px. Ring and elastic offset advance half as fast for the same finger distance; return duration remains 260ms. Updated gesture regression distances.


## 2026-10-22 — Category expansion button shadow at 4%

- UrfuNavigator-web: circular All/Fewer categories button surface uses 0 0 10px black at 4%, matching category/building cards in both themes. Removed shadow-subtle from this surface.


## 2026-10-22 — Optional category gesture haptics

- UrfuNavigator-web: completed category end-pull attempts one 12ms vibration synchronously on trusted touchend, before opening. If Vibration API is unavailable/refuses, feature-detected native checkbox switch is clicked during user activation as a Safari fallback.
- Hidden/inactive/synthetic events and incomplete/cancelled gestures remain silent. The fallback control is outside keyboard/accessibility navigation, reused and removed on hook cleanup. No permissions are requested. Browser/system suppression does not block opening.
- Automated tests cover one pulse per completed release, cancellation, native-first behavior, switch reuse/cleanup and unsupported cases. Actual iPhone/Android hardware feedback is unverified; switch fallback is best effort, not guaranteed Safari haptic support.


## 2026-10-22 — Android haptic activation fix

- UrfuNavigator-web: removed the transient activation guard before native vibrate; the browser enforces its sticky-activation policy. Safari switch fallback still requires transient activation. Increased the single impulse from 12ms to 30ms.
- Regression verifies native vibration is attempted even when isActive is false. Actual phone vibration remains unverified and may be suppressed by browser/system settings. Trigger remains completed pull release, not ordinary scrolling or partial pulls.


## 2026-10-22 — Haptic on full category ring

- UrfuNavigator-web: haptic now runs on touchmove when the pull first reaches 144px (full ring), once per gesture. Reversal/re-crossing and release do not repeat the pulse; a new touch gesture rearms it. Catalog still opens only on completed release.
- Native Android vibration remains best effort. Safari switch feedback at touchmove is less reliable because transient activation may not be available during scrolling.


## 2026-10-22 — Campus picker entry on home

- UrfuNavigator-web: appended Choose campus to the home building list on mobile/desktop. Button opens a Campuses drawer state with title/close and intentionally empty body. It uses the existing 90% mobile drawer animation and returns to Institutes when closed.
- Compact mobile building carousel reuses the same 144px end-pull, progress ring, elastic return and one threshold haptic as categories. Included the picker in card count/index/visibility so expanded morph geometry remains aligned.
- Extracted shared gesture/haptic code to shared/lib/useCarouselEndPull and shared/lib/haptic; point-search and the building widget use the same implementation through the shared public API. Added Choose campus labels for all four locales. No campus backend calls or fake campus data.
- Nine gesture/haptic regression tests passed after extraction; build passed.


## 2026-10-22 — Campus selection as independent modal

- UrfuNavigator-web: Choose campus now sets campusOpen independently of sidebar content/history. Lazy CampusLayer renders a separate Radix portal over the persistent building panel, with title, close control and intentionally empty body. Removed the Campuses content state.
- Closing restores focus without replacing the underlying building list or its drawer height/scroll. Route changes clean up the modal. Opening cancels pending map restoration; expanded-controls selector includes campusOpen.
- Regression checks modal open/close preserve content and prevContent.


## 2026-10-22 — Mobile Back restores panels before page navigation

- UrfuNavigator-web: app/model/usePanelBack records mobile panel checkpoints using app/lib/panelHistory and one same-URL history guard, preserving existing router state. Back restores the previous panel checkpoint; only after reaching the base panel does the next Back navigate away.
- Covers settings/campus modal flags, category/search/route/expanded building content and selected room descriptions. Base collapsed/normal height is recorded through setRestingHeight; restorePanel revision tells useSideMenu to cancel active gestures/map restoration and animate to the saved resting height. Gesture frames are not history entries.
- Manual closes prune known checkpoints; closing to base removes the guard. Desktop does not install the handler; switching to desktop removes its guard. Route changes start a fresh stack, with saved stacks recovered when navigating back to a prior guarded route. Browser-controlled keyboard dismissal may happen before history Back.
- Validation: four history-controller regressions cover nested Back, manual dismissal, route return, root-page navigation and disposal; five existing search/sidebar regressions passed. Web build and lint/FSD passed. Real Android/iOS system Back remains unverified.


## 2026-10-22 — Delivery documentation audit

- Reconciled current README/contracts with implemented defaults and consumer overrides, added documentation-audit.md with coverage, reproducible validation and device/integration limitations. Historical entries remain identifiable as history. Prepared a cohesive local commit for this repository; no remote publication/deployment.


## 2026-10-23 — Active gesture right-angle attraction

- Added optional rotationSnapDuringGesture (default false) in renderer 1.5.0; web enables it with range 25°. A continuous monotone curve attracts the shown angle, holding exactly within the inner 20% of the range. Raw finger angle stays independent, preserving reversal and preventing accumulated drift. Release settling is retained and uses the raw angle to check range.
- Existing consumers retain release-only behavior unless opting in.


## 2026-10-23 — Room information as independent modal

- UrfuNavigator-web: moved room details out of the building map controls container into a lazy widget layer alongside Settings/Campus overlays. Radix portal preserves the main panel and handles focus/modal semantics. Selected point state continues to integrate with mobile Back.
- Unified 90% mobile/356px desktop shell, header/close, palette/typography, card sections and route buttons. Mobile header supports downward dismissal; desktop dismisses through close button only. Retained last loaded data during exit to avoid flashing empty content.
- Added localized section/error labels for all four locales, loading skeleton and retryable error state. Route endpoint actions and room metadata/schedule remain functional. Existing type/schedule value translations remain unchanged.
- Browser verified search-result opening for M-139, room metadata/schedule and ToHere dismissal. Build/lint/FSD and existing regression tests checked; physical mobile swipe needs device verification.


## 2026-10-23 — Share settings/room modal swipes

- UrfuNavigator-web: extracted the existing settings full-surface touch mechanism into shared/lib/useModalSwipe. Settings and room details both use its 6px directional threshold, 32px dismissal threshold, scroller guard, reset and touchcancel behavior. Removed the separate room-header pointer gesture implementation.
- Room handle now uses the exact settings asset/button markup. Removed Institute section and its building lookup. Room title/body text can be selected/copied; buttons remain nonselectable. Shared swipe yields when a text selection exists, preserving selection interaction.
- Added shared-hook regressions for full-surface dismiss, scrolled body, text selection, horizontal input, desktop disable, short swipe, cancellation and cleanup.


## 2026-10-23 — Preserve floor-switch taps beside panels

- UrfuNavigator-web: floor selector no longer carries data-map-interaction, so pressing it does not trigger the main drawer auto-collapse/hide its controls between touchstart and click. Map surface interactions retain automatic collapse.
- Room details uses a non-modal Radix dialog so visible map controls can receive input. Outside-interaction dismissal explicitly exempts the floor selector; desktop outside dismissal remains disabled. Other mobile outside interactions still dismiss details. Settings/campus remain modal.
- Added data-floor-switcher marker on the feature root to avoid coupling to button text or CSS layout.


## 2026-10-23 — Search room focus and collapsed details preview

- Renderer 1.6.0 exposes optional focus camera/highlight props. Camera translates for 300ms on the same floor, preserving scale/rotation and drag bounds, interruptible by input, with reduced-motion support. Cross-floor/building searches use duration 0 after data loads. Room fills/strokes are overridden only where room.pointId matches; unlinked service/graph points cannot receive a room tint.
- Web browse selection stores a versioned focus request and opens collapsed information instead of full details. Main menu stays mounted but hidden/inert while focus owns the view. Closing clears the override and restores it; route selection does not enter this scenario.
- Preview height measures the header/actions plus the next section label and 28px of its content. Shared settings swipe now optionally supports upward expand and downward collapse. Preview content can also be tapped to expand. Search preview ignores outside clicks so the map remains usable. Direct map-room taps open full information.
- Mobile Back checkpoints include collapsed/full details state. Preview display is retained through exit animation. Camera center reserves an initial 244px mobile preview area; exact room centering remains subject to bounds.


### 2026-10-23 — Search-only room preview
- Repository: `UrfuNavigator-web`. Search-origin room details collapse to the measured header and route buttons, including body padding; the previous information-section teaser is removed.
- `previewEnabled` records the entry scenario independently of the retained map focus. A direct map selection always opens full details and disables the preview, including when selecting the same room after search. Shared settings swipe dismisses this panel directly.
- Mobile panel history restores the entry scenario and collapsed state together. Reducers reject collapse for map-origin details.
- No map rendering or admin-data overrides were added.


### 2026-10-23 — Stable room preview opening
- `UrfuNavigator-web`: preview height is available from the first render (151px desktop, 175px mobile: shared header, 47px route actions, padding). Removed asynchronous content measurement and its visible height correction during loading.
- Each search focus version starts a fresh details instance, resetting gesture and exit state even for the same room. Compact-body clicks no longer expand the panel; expansion uses the handle or shared upward swipe.
- Regression coverage verifies a repeated search after expansion restores the compact state and increments the presentation version. No library/admin overrides changed.


### 2026-10-23 — Room selection highlight and search zoom
- Repositories: `UrfuNavigator-web` and `konva-floor-plan` (existing `feat/map-label-rotation` branch). Web consumes local renderer 1.7.0.
- Map-origin selected point now highlights matching room.pointId with the same light/dark fill and blue stroke as search, without camera movement. Dismissal clears selection and restores scheme colors. Room geometry and saved admin data are unchanged; graph points lacking a linked room cannot tint a room.
- Search sets focus.minScale=0.9; renderer animates translation and zoom together over 300ms on the same floor, preserves rotation and an already closer zoom, respects drag bounds and user interruption. Cross-floor focus remains immediate.
- Temporary paint overrides are controlled by FloorMap focus fill/stroke; remove those fields to restore admin schemes. Omit minScale to preserve prior search zoom.


### 2026-10-23 — Reduced search focus zoom
`UrfuNavigator-web`: search focus.minScale reduced from 0.9 to 0.6 (one third lower). A closer existing zoom remains unchanged. Camera policy only; no admin data or library defaults changed. Omit minScale to preserve the current zoom.


### 2026-10-23 — Search focus zoom 0.3
`UrfuNavigator-web`: search focus.minScale is now 0.3, superseding 0.6. Existing closer zoom is preserved. Consumer camera setting only; admin data and renderer defaults are unchanged.


### 2026-10-23 — Hide information sections in compact room details
`UrfuNavigator-web`: compact preview explicitly hides body children other than route actions, so section headings such as Type cannot appear in the bottom padding. Visibility preserves layout for the shared expansion gesture; full details retain selectable content.


### 2026-10-23 — Compact room panel ends at route buttons
`UrfuNavigator-web`: removed the visibility override. Reduced compact height by the 16px body bottom padding: 135px desktop / 159px mobile. The viewport ends at the route buttons; subsequent sections retain their normal visibility and are clipped by the compact body overflow. This supersedes the prior 151/175px dimensions and hiding workaround.


### 2026-10-23 — Smooth room color transitions
Repositories: `konva-floor-plan` (feat/map-label-rotation) and `UrfuNavigator-web`. Local renderer 1.7.1 animates fill/stroke over 220ms for both search/map selection, deselection and scheme/theme changes. Interrupted transitions continue from displayed paint; reduced motion is immediate. No additional admin overrides or saved-data changes.


### 2026-10-23 — Panel return and room-attached floor controls
`UrfuNavigator-web`: main panel and its actions fade/translate back over 180ms after room details close. Covered panels remain mounted and inert. Map controls fade instead of display:none. In mobile compact room details, floor controls anchor 8px above the visible room panel using shared --room-preview-height and live --room-panel-lift, ignoring hidden main-panel height/expanded state. Full room details hide map controls. Desktop floor controls retain their top placement; reduced motion disables transitions.


### 2026-10-23 — Floor controls follow panel without lag
`UrfuNavigator-web`: removed bottom/max-height transitions from floor-switcher-position. Floor controls immediately follow the panel offset, matching other attached controls. Visibility fades remain unchanged.


### 2026-10-23 — Floor-list overflow anticipation
`UrfuNavigator-web`: ResizeObserver compares the complete floor list with the space above the active panel. Hide with 160ms opacity/6px translation when less than 24px spare space remains; show again with at least 32px spare (8px hysteresis). Hidden controls are inert. Available space follows the panel without position easing; list is no longer clipped while fading. Reduced motion removes animation.


### 2026-10-23 — Five-row scrolling floor selector
`UrfuNavigator-web`: floor selector has at most five visible rows including ▲/▼ controls. Top/bottom indicators appear only when more floors remain in that direction, reserving one row each (three floor rows between two indicators). Native touch/wheel scrolling and clickable paging arrows; selected floor is brought into view after external floor changes. Rows remain 34px with 5px gaps. Overflow-fit observer measures this compact selector rather than every floor. Arrow labels localized ru/en/zh/ar.


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


### 2026-10-23 — Campus selection
`UrfuNavigator-web`: campus entity owns selected campus and focus request version. Independent expanded campus overlay now uses 100px institute-style cards with admin SVGs (Mira/GUK, Lenina/UGI, unavailable Novokoltsovsky/IRIT). Unavailable card disabled, grayscale icon, weak text and localized status. Existing shared full-panel mobile swipe and Back handling retained. Choosing an available campus closes overlay and centers Yandex map at zoom 15 (Mira original 56.842,60.652; Lenina 56.840429,60.616079) with 350ms move; repeated selection refocuses. No filtering of institute list, backend writes or map API migration. Selection lasts for current app session.


### 2026-10-23 — Campus-scoped institute list
`UrfuNavigator-web`: InstitutesList filters the building list by selected campus: Mira excludes slug ugi, Lenina includes only ugi. Morph/carousel card counts use the filtered list; campus picker remains available in both. Map markers and global search data are unchanged. This explicit client-side campus mapping supplements backend building data; remove the filter to restore the full list.


### 2026-10-23 — Campus action button
`UrfuNavigator-web`: the Campus action next to Route now opens the existing campus selector overlay via setCampusOpen(true), sharing the institute-list picker flow and mobile Back handling. It no longer resets underlying content or navigates home.


### 2026-10-23 — Independent route overlay
`UrfuNavigator-web`: Route action opens a lazy independent modal using the settings shell/shared full-surface mobile swipe. Sidebar routeOpen/routeContent hold route and endpoint-search screens separately from main content, which remains unchanged under the overlay. Existing setContent(Route) entry points open the overlay; endpoint search/selection/cancel return inside it. Mobile Back snapshots restore route modal and nested search state; desktop closes by explicit close control. Closing overlay retains chosen route endpoints. No backend/library changes.


### 2026-10-23 — External link opening policy
`UrfuNavigator-web`: audited all application-owned anchors. Social links, feedback forms, privacy PDF and Yandex terms use target=_blank; standardized rel=noopener noreferrer. Internal institute links retain SPA navigation. Future external navigation links must use the same target/rel.


### 2026-10-23 — Campus card text alignment
`UrfuNavigator-web`: campus card text aligns to the top with 12px vertical padding rather than vertical center. Institute cards remain unchanged.


### 2026-10-23 — Explicit expanded building titles and descriptions
`UrfuNavigator-web`: building card metadata now has optional expandedTitle, distinct from compact label; no parentheses parsing. Expanded titles crossfade/translate with existing per-card detail progress during mobile expansion; desktop full list shows expanded title directly. GUK: ГУК (ГУК, Э, И, М); ISA: ИСА (С, СП); UralENIN: УралЭНИН (Т); INMIT/HTI: ИНМиТ / ХТИ (МТ, Х). Added user-provided ISA/UralENIN/INMIT full descriptions and addresses; retained GUK/IRIT details and explicit ИРИТ-РТФ (Р) expanded title. Local presentation metadata overrides API display name for these cards; remove expandedTitle/fullName/address entries to restore default labels/details. No API/admin writes or icon changes.


### 2026-10-23 — Separate FTI/HTI catalog cards
`UrfuNavigator-web`: shared BuildingCard supports expanded title, icon-by-name and disabled status. Mira catalog adds unavailable ФТИ (fti.svg) and ХТИ (Х), Химико-технологический институт, ул. Мира, 28 (hti.svg), linking to existing /institute/inmit-hti. Existing combined card becomes ИНМиТ (МТ), Институт новых материалов и технологий; HTI wording removed there. Named icons use a building-slice RTK query to /api/icons/:name, no floor-slice cross-import or stored signed URLs. Catalog additions/presentation overrides are local only; API building list, map markers and admin records unchanged.


### 2026-10-23 — Unavailable institute card details
`UrfuNavigator-web`: unavailable BuildingCard now displays its full institute name and unavailable status in the expanded details block, with status replacing the address. Compact FTI card shows only ФТИ; expanded card shows Физико-технологический институт and Недоступен. Existing detail morph controls visibility; disabled navigation remains unchanged.


### 2026-10-23 — FTI catalog order
`UrfuNavigator-web`: unavailable FTI card sorts after all institute cards in the Mira catalog, before the campus-picker action. Other institute ordering remains unchanged.


### 2026-10-23 — Unavailable Kuibysheva campus
`UrfuNavigator-web`: campus chooser adds localized ул. Куйбышева, disabled with unavailable status, weak text and grayscale ienim.svg. Named icon comes from cached building icon query only while chooser is open. No map destination or selectable state for this campus.


### 2026-10-23 — Campus names and InFO card
`UrfuNavigator-web`: display names changed from ул. Мира to Втузгородок and р-н Новокольцовский to Новокольцовский (locale labels updated; stable campus IDs retained). Verified info.svg returns HTTP 200 from storage via named-icon API. Added ИнФО card to Vtuzgorodok catalog, using info.svg and existing /institute/uralenin route. FTI remains last. No invented institute description/address or backend changes.


### 2026-10-23 — Local building visit ranking
`UrfuNavigator-web`: navigator.building-visits.v1 stores versioned per-canonical-building-slug counters in localStorage, with input validation and storage-error fallback. App-level route observer counts once on building entry (cards/map markers/search/direct entry); same-building searches/floor changes/re-renders do not increment. Returning home or entering another building allows another visit. Shared map destinations combine INMIT/HTI and UralENIN/InFO. InstitutesList snapshots counts at mount so visible cards do not jump; ranks descending within selected campus, ties use existing order, FTI remains last and campus picker stays outside sorting. Device/browser-local only, no backend/analytics calls. Clear storage key to reset.


### 2026-10-23 — InFO card details
`UrfuNavigator-web`: ИнФО expanded title is ИнФО (Т), description Институт фундаментального образования, address ул. Софьи Ковалевской, 5. Existing info.svg and /institute/uralenin destination retained. Details follow the standard expanded-card morph.


### 2026-10-23 — Preserve searched room floor on building entry
`UrfuNavigator-web`: useInstituteBuilding initialization considers the ordinary-search focus before route endpoints/default floor. A matching building and valid floor ID are required; unrelated focus is ignored. This prevents floorReset(first) from overriding useSelectPoint after home search. Initialization guard still permits manual floor changes afterward; GPS priority remains lower. Added browse/route/unrelated-focus regression scenarios.


### 2026-10-23 — Room route actions open route overlay
`UrfuNavigator-web`: explicit from/to selection (room Отсюда/Сюда buttons) populates the requested endpoint and opens the independent route overlay; opposite endpoint is preserved. Room details close as before and do not restore focus behind the newly opened route modal. Regular route-search selection retains its existing flow. Added explicit direction regression assertions for both endpoints.


### 2026-10-23 — Default route origin from current building entrance
`UrfuNavigator-web`: selecting To while viewing /institute/:slug asynchronously queries explicit Exit points on floor numbered 1 of the source/viewed building. Empty From fills with main-named entrance, otherwise stable ID choice. Home selection never autofills; existing manual From is preserved. Source captured before destination navigation. Route revision guard discards stale responses after manual changes, clear or destination changes. Missing entrance/floor/network failure leaves From empty. Applies to room Сюда and route endpoint search; destination floor is unchanged. No backend writes.


### 2026-10-24 — Completed route replaces the main panel
`UrfuNavigator-web`: incomplete route remains an independent builder overlay. With both endpoints present and search finished, app presentation coordinator closes the overlay and marks routeDocked; main panel renders compact route fields in its normal footprint, keeping underlying page content. Editing an endpoint reopens search overlay; completion returns to docked route. Header Back clears route and restores normal panel. Mobile browser Back from docked route clears route and prunes builder/search history; nested overlays/search close first. Route docking does not expand panel to 90% or auto-collapse from map interaction. Added sidebar/history regressions.


### 2026-10-24 — Inline route endpoint search
`UrfuNavigator-web`: activating route From/To edits that field in place with autofocus; other endpoint remains visible. RoutePanel owns inline categories/history and results for both builder overlay and docked main panel. Docked endpoint editing no longer opens a modal; routeContent is independent of routeOpen. Mobile docked panel expands for results and settles after selection. QuickTypes expandable=false removes all-categories action and end-pull gesture; category choice preserves route direction/endpoints. Escape/header Back/system Back finish search before resetting route. Supersedes earlier separate endpoint-search overlay design. Shared general search remains unchanged.


### 2026-10-24 — Browser autofill disabled
`UrfuNavigator-web`: shared Input sets autoComplete=off for all current text fields (general search and both route endpoints), after forwarded props so callers cannot accidentally re-enable it. Application search history remains available; no changes to spellcheck or keyboard suggestions.


### 2026-10-24 — Route search field semantics for Android
`UrfuNavigator-web`: route fields previously defaulted to type=text despite being room search. They now use type=search, inputMode=search, enterKeyHint=search, neutral room-query names, no autocorrect/capitalization/spellcheck and existing autocomplete=off. Native search clear decoration hidden to avoid duplicate controls. Android Chrome keyboard accessory bar is browser-owned; HTML attributes are best-effort and do not guarantee its suppression. Physical-device verification pending.


### 2026-10-24 — Figma route editor 2900:1776
`UrfuNavigator-web`: route fields move into shared white header with 6px gap, 40px inputs, exact 10px dot asset 95bdb.svg and existing 20px clear icons. Body contains only history or search results; route categories removed entirely. No visible Route heading in expanded mobile editor. Docked mobile route settles at standard 80px search-only panel, showing destination summary with search icon and Back/reset control; activate row to edit. Expanded header uses both editable fields. Endpoint clear preserves opposite point and stays in editor. Figma session 614225e6-233d-4974-bb98-c98a93ed43d4; reference map imagery remains dynamic, not a design screenshot asset.

Visual QA: browser viewport 393×852 verified against Figma: 40px fields/6px gap in header, history with search icons, no categories. Selected two points, verified 80px compact destination row, reopened and cleared origin in-place without a modal. Existing cross-building controls may overlap floor selector outside this task; left unchanged.


### 2026-10-24 — Пустая панель маршрута
В полях маршрута удалены SVG-точки. Крестик отображается только при видимом содержимом поля (запрос при редактировании, выбранная точка в остальном состоянии). При открытии пустого маршрута панель ограничена заголовком с двумя полями, история не монтируется. Активация поля раскрывает поиск с историей; завершение поиска без выбранных точек возвращает компактную высоту. Используются существующие состояния routeContent и общий свайп модальных панелей.


### 2026-10-24 — Документирование дефекта поиска аудитории
В current-state.md добавлена открытая проблема: запросы с дефисом/пробелом (`р-202`, `р 202`) возвращают нерелевантный список, слитный запрос (`р202`) не находит аудитории. Зафиксированы ожидаемое поведение и условия проверки; причина не установлена, код не менялся.


### 2026-10-24 — Маршрут скрывает основную панель
В UrfuNavigator-web при routeOpen основная панель скрыта общим состоянием is-room-covered, исключена из accessibility tree и взаимодействий через inert. Сохраняется смонтированной для восстановления прежнего состояния. В редактор маршрута добавлена видимая кнопка «Назад» на мобильном и десктопе: сбрасывает маршрут, закрывает редактор и возвращает обычную панель. В компактном построенном маршруте кнопка возврата также использует стрелку вместо крестика. Существующая обработка системной кнопки назад на мобильном сохраняется.


### 2026-10-24 — Вход при открытии маршрута
UrfuNavigator-web: при открытии редактора маршрута на странице корпуса поле «Откуда» заполняется явным входом первого этажа текущего корпуса из API, даже до выбора «Куда». Используется общий fillRouteEntrance: главный вход приоритетен, иначе стабильный выбор по ID. Ручная начальная точка сохраняется; revision и destinationId защищают от запоздалого ответа после очистки или изменения маршрута. Повторный рендер не заполняет вручную очищенное поле заново. На главной без определённого корпуса вход не подставляется; при отсутствии данных входа поле остаётся пустым. Координаты входов не захардкожены.


### 2026-10-24 — Удаление кнопки «Назад» из редактора маршрута
В UrfuNavigator-web убрана отдельная стрелка возврата рядом с двумя полями редактора маршрута; поля снова занимают всю доступную ширину. Системный возврат на мобильном, общий свайп закрытия и скрытие основной панели сохраняются. На десктопе доступна кнопка закрытия крестиком. Кнопка сброса уже построенного маршрута в компактной основной панели не менялась.


### 2026-10-24 — Иконки истории в маршруте
UrfuNavigator-web: недавние места в редакторе маршрута используют стандартную иконку истории 8942d.svg. Удалён неиспользуемый вариант SearchHistory с иконкой поиска (searchIcon), ранее введённый для макета маршрута. Содержимое истории и выбор точки не менялись.


### 2026-10-24 — История маршрута выбирает назначение
UrfuNavigator-web: RoutePanel передаёт SearchHistory явное направление to. Выбор недавнего места в маршруте заполняет «Куда», независимо от активного поля; «Откуда» сохраняется. Обычная история поиска без direction продолжает использовать текущий сценарий выбора. Результаты текстового поиска по-прежнему заполняют активное поле.


### 2026-10-24 — Условие назначения истории маршрута
UrfuNavigator-web: история заполняет «Куда» только при наличии выбранной точки route.from (в том числе входа из API). Если начальная точка не выбрана или очищена, история заполняет «Откуда». Введённый поисковый текст сам по себе не считается выбранной точкой. Это уточняет предыдущую запись о безусловном выборе назначения; текстовые результаты сохраняют направление активного поля. Регрессионная проверка покрывает пустое поле, выбранный вход и последующую очистку.


### 2026-10-24 — Возврат по этажам построенного маршрута
UrfuNavigator-web: мобильная история панелей сохраняет выбранный этаж для построенного (routeDocked) маршрута. Системный Back сначала восстанавливает предыдущий этаж того же маршрута, не очищая точки. Когда смен этажей в истории больше нет, Back сбрасывает маршрут как раньше. Проверка revision отделяет состояния разных маршрутов; вложенный поиск, настройки и карточки сохраняют прежний приоритет возврата. Переход на другую страницу изолирует стек существующим механизмом panelHistory. Добавлен регрессионный тест возврата через два этажа до отмены маршрута.


### 2026-10-24 — Два поля в сложенном маршруте
UrfuNavigator-web: компактный построенный маршрут показывает оба RouteSearchField («Откуда» и «Куда») вместо одной сводной строки. Высота каждого поля 40px, промежуток 6px; нижняя граница мобильной панели маршрута увеличена с 80 до 126px. История/результаты в сложенном состоянии скрыты, активация любого поля раскрывает встроенный поиск. Минимальная высота жеста и расчёт доступной области учитывают новый размер. Кнопка сброса компактного маршрута сохранена.


### 2026-10-24 — Переключение на назначение после заполнения начала
UrfuNavigator-web: координатор маршрута отслеживает изменение выбранной начальной точки и переключает направление поиска на to независимо от источника заполнения (вход API, история, ручной выбор). Если открыт поиск и назначение ещё не выбрано, показывается история и автофокус переходит в «Куда». В сложенном редакторе переключается направление без принудительного вызова клавиатуры. Последующие рендеры не мешают вручную вернуться к редактированию «Откуда»; очистка начала не переводит фокус.


### 2026-10-24 — Устойчивый Back после возврата этажа
UrfuNavigator-web: смены этажей одного построенного маршрута создают собственные записи browser history заранее, при смене этажа. Возврат на прошлый этаж восстанавливает сохранённый стек из существующей записи и не требует создания защитной записи внутри popstate. Это устраняет зависимость последовательного Back по этажам от повторного pushState при возврате. После последнего этажа следующее нажатие отменяет маршрут внутри сайта. Добавлен тест нескольких последовательных возвратов без добавления записей в popstate; физическое устройство не проверялось.


### 2026-10-24 — Текстовый фокус назначения после заполнения начала
UrfuNavigator-web: после изменения выбранного «Откуда», если «Куда» ещё не выбрано, координатор открывает редактирование назначения (TypeList) даже из сложенного редактора. RouteSearchField монтирует Input с autoFocus: это текстовый фокус с курсором и запросом экранной клавиатуры, а не только смена direction. Отменяет прежнее ограничение «без вызова клавиатуры в сложенном состоянии». Уже полностью заполненный маршрут не раскрывается повторно. Фактическое открытие клавиатуры при асинхронном заполнении входа зависит от ограничений мобильного браузера; физическое устройство не проверялось.


### 2026-10-24 — Только один возврат этажа
UrfuNavigator-web: первое системное «Назад» после смен этажей возвращает непосредственно предыдущий этаж и потребляет всю цепочку этажей маршрута. Следующее нажатие выходит из маршрута, не перебирая более ранние этажи. Оставшиеся служебные записи этажей удаляются при выходе, чтобы последующие нажатия не открывали старые состояния. Это заменяет прежнее последовательное прохождение всех этажей. Регрессионный сценарий: 1 → 2 → 3 → Назад (2) → Назад (обычная панель).


### 2026-10-24 — Подготовка коммитов и статус UX маршрута
Добавлен route-ux.md: UX маршрута явно отмечен как требующий доработки, описаны актуальные состояния, ограничения и сценарии приёмки. Обновлены current-state, design-system и documentation-audit, чтобы отличать последние требования от исторических промежуточных реализаций. Подготовлены отдельные локальные коммиты web и renderer; удалённая публикация не выполняется.


### 2026-10-24 — Совместимость исходного серверного запуска
UrfuNavigator-web: Dockerfile копирует vendor перед frozen install; путь tarball в package.json/lockfile нормализован для Linux. BuildKit NODE_AUTH_TOKEN стал необязательным для текущей vendored-зависимости, но существующая передача секрета сохранена. Исходные nginx:80, SPA fallback, entrypoint config.js и runtime API_BASE сохранены без изменений логики. Локальные env исключены из build context, shell-скрипты закреплены LF через .gitattributes. Сервер использует прежний API_BASE и внешний proxy/CORS, локальный Vite /backend на nginx не переносится. Инструкции добавлены в README.

Validation: actual Linux Docker image built without secret; runtime container passed nginx syntax, root/assets/locales, SPA deep-link fallback and API_BASE/no-store smoke. Temporary container removed. Web: 56 tests, frozen install, build and lint passed. No production publication/deployment.
