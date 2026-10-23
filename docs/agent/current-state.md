# Current implementation — 2026-10-24

This is the current-state index. Earlier dated sections in architecture/design-system and the changelog explain the evolution; when an old value differs, use this index and the override registry. Source is authoritative. No server/admin data is rewritten by UI overrides.

## Route UX status

**Route UX requires further work and physical-device validation.** Current behavior, open questions and acceptance scenarios are consolidated in [route-ux.md](route-ux.md). Historical entries below describe superseded intermediate behavior as well as the latest changes.

## Boundaries and delivery

- Web owns routing, API access, Redux, panels, user settings, translations, sensor permissions and application appearance policy. Code follows FSD and public slice exports; `pnpm check:fsd` enforces boundaries.
- The sibling konva-floor-plan library owns canvas rendering, room hit testing, annotation transforms and map gestures. Web consumes the vendored 1.13.0 archive, not an uncommitted import from sibling src. See [vendor provenance](../../vendor/README.md).
- No changes to API/backend/graphs/mobile repositories are part of this delivery. No publication or deployment is performed.

## Main flows and source map

| Area | Current behavior | Source |
| --- | --- | --- |
| Persistent navigator | One panel survives home/building navigation; data/content changes within it. Mobile search-only/base/expanded heights use fixed viewport geometry and keyboard handling. Manual collapse differs from map-interaction collapse, which restores after 1.5s. | src/widgets/side-menu/model/useSideMenu.ts; src/app/model/useAppEnvironment.ts |
| Buildings | Desktop rows are expanded immediately; mobile carousel morphs continuously into detail rows. Admin SVG icons render in a centered 75px square within a 100px slot. Local photo/illustration assets are retained but inactive. | src/widgets/side-menu/ui/InstitutesList.tsx; src/entities/building/ui/BuildingLink.tsx |
| Settings | Separate lazy Radix modal; desktop has no swipe handle and closes by its close button only. Mobile supports swipe/backdrop. Theme reveal cannot dismiss the modal through a retargeted double click. | src/widgets/side-menu/ui/SettingsLayer.tsx; src/widgets/side-menu/ui/SettingsOverlay.tsx |
| Campus selection | Home campus buttons and carousel end-pull open a separate modal with campus cards; selection filters buildings and refocuses the map. Unavailable campuses are disabled. Underlying content/scroll stays mounted. | src/widgets/side-menu/ui/CampusLayer.tsx; src/widgets/side-menu/ui/CampusOverlay.tsx |
| Categories | All categories expands mobile panel to 90% without focusing input. Expanded grid stretches columns from a 100px minimum, with 8px gaps and 132px height. | src/features/point-search/ui/QuickTypes.tsx; src/app/styles/index.css |
| End-pull gestures | Category and building carousels share native scrolling plus a 144px end pull. Ring fills with elastic list motion; incomplete pulls return over 260ms. Full ring attempts one 30ms haptic; release opens the destination. | src/shared/lib/useCarouselEndPull.ts; src/shared/lib/haptic.ts |
| Mobile Back | Same-URL history guard restores settled panel checkpoints, selected room and drawer target height before normal page Back. Manual closes prune checkpoints; desktop has no handler. | src/app/model/usePanelBack.ts; src/app/lib/panelHistory.ts |
| Room details | Independent lazy non-modal Radix dialog above the map/main panel; shared settings shell, loading/error/retry, route actions, selectable text and shared full-surface mobile swipe; search uses a fixed-height header/actions preview with upward expansion/downward collapse. | src/widgets/point-details/ui/PointDetailsLayer.tsx; src/widgets/point-details/ui/PointDetails.tsx |
| Search | Browse/from/to query slots are separate. Ordinary search clears route, focuses/highlights the room and opens a collapsed details preview; route search changes only its requested endpoint. History uses the same selection hook. | src/features/point-search/model/pointSearchSlice.ts; src/features/point-search/model/useSelectPoint.ts |
| Category queries | All categories use /api/points type filtering without sending translated labels as room names. Current building/floor are exact filters. Prefix fetching and slicing emulate pagination because that endpoint has no offset. Free text uses /api/search. | src/entities/point/api/pointApi.ts |
| Theme and locale | Circular view-transition theme reveal with reduced-motion fallback; explicit locale is persisted, otherwise browser languages choose the available local locale. ru/en/zh/ar share translation keys; Arabic uses RTL. | src/features/change-theme/model/useThemeTransition.ts; src/shared/config/i18n/i18n.ts |
| Startup | Initial locale readiness precedes mount; settings/results/route content are lazy; skeletons cover loading; destination code/floor prefetch follows user intent and save-data preference. | src/main.tsx; src/app/model/usePagePreload.ts |
| Indoor policy | First floor numbered 1 is preferred. Text is Golos UI Regular #60636C, 9–16px, fade multiplier 0.75 (3–6px). Icon size 16–26px; rotation threshold 20°, sensitivity 1.2, active/release snap range 25° (exact hold within 5°), settle 220ms. | src/widgets/floor-map/ui/FloorMap.tsx; [override registry](map-overrides.md) |
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


### 2026-10-23 — Compact room panel ends at route buttons
`UrfuNavigator-web`: removed the visibility override. Reduced compact height by the 16px body bottom padding: 135px desktop / 159px mobile. The viewport ends at the route buttons; subsequent sections retain their normal visibility and are clipped by the compact body overflow. This supersedes the prior 151/175px dimensions and hiding workaround.


### 2026-10-23 — Smooth room color transitions
Repositories: `konva-floor-plan` (feat/map-label-rotation) and `UrfuNavigator-web`. Local renderer 1.7.1 animates fill/stroke over 220ms for both search/map selection, deselection and scheme/theme changes. Interrupted transitions continue from displayed paint; reduced motion is immediate. No additional admin overrides or saved-data changes.


### 2026-10-23 — Panel return and room-attached floor controls
`UrfuNavigator-web`: main panel and its actions fade/translate back over 180ms after room details close. Covered panels remain mounted and inert. Map controls fade instead of display:none. In mobile compact room details, floor controls anchor 8px above the visible room panel using shared --room-preview-height and live --room-panel-lift, ignoring hidden main-panel height/expanded state. Full room details hide map controls. Desktop floor controls retain their top placement; reduced motion disables transitions.


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


### 2026-10-23 — Independent route overlay
`UrfuNavigator-web`: Route action opens a lazy independent modal using the settings shell/shared full-surface mobile swipe. Sidebar routeOpen/routeContent hold route and endpoint-search screens separately from main content, which remains unchanged under the overlay. Existing setContent(Route) entry points open the overlay; endpoint search/selection/cancel return inside it. Mobile Back snapshots restore route modal and nested search state; desktop closes by explicit close control. Closing overlay retains chosen route endpoints. No backend/library changes.


### 2026-10-23 — Explicit expanded building titles and descriptions
`UrfuNavigator-web`: building card metadata now has optional expandedTitle, distinct from compact label; no parentheses parsing. Expanded titles crossfade/translate with existing per-card detail progress during mobile expansion; desktop full list shows expanded title directly. GUK: ГУК (ГУК, Э, И, М); ISA: ИСА (С, СП); UralENIN: УралЭНИН (Т); INMIT/HTI: ИНМиТ / ХТИ (МТ, Х). Added user-provided ISA/UralENIN/INMIT full descriptions and addresses; retained GUK/IRIT details and explicit ИРИТ-РТФ (Р) expanded title. Local presentation metadata overrides API display name for these cards; remove expandedTitle/fullName/address entries to restore default labels/details. No API/admin writes or icon changes.


### 2026-10-23 — Separate FTI/HTI catalog cards
`UrfuNavigator-web`: shared BuildingCard supports expanded title, icon-by-name and disabled status. Mira catalog adds unavailable ФТИ (fti.svg) and ХТИ (Х), Химико-технологический институт, ул. Мира, 28 (hti.svg), linking to existing /institute/inmit-hti. Existing combined card becomes ИНМиТ (МТ), Институт новых материалов и технологий; HTI wording removed there. Named icons use a building-slice RTK query to /api/icons/:name, no floor-slice cross-import or stored signed URLs. Catalog additions/presentation overrides are local only; API building list, map markers and admin records unchanged.


### 2026-10-23 — Campus names and InFO card
`UrfuNavigator-web`: display names changed from ул. Мира to Втузгородок and р-н Новокольцовский to Новокольцовский (locale labels updated; stable campus IDs retained). Verified info.svg returns HTTP 200 from storage via named-icon API. Added ИнФО card to Vtuzgorodok catalog, using info.svg and existing /institute/uralenin route. FTI remains last. No invented institute description/address or backend changes.


### 2026-10-23 — Local building visit ranking
`UrfuNavigator-web`: navigator.building-visits.v1 stores versioned per-canonical-building-slug counters in localStorage, with input validation and storage-error fallback. App-level route observer counts once on building entry (cards/map markers/search/direct entry); same-building searches/floor changes/re-renders do not increment. Returning home or entering another building allows another visit. Shared map destinations combine INMIT/HTI and UralENIN/InFO. InstitutesList snapshots counts at mount so visible cards do not jump; ranks descending within selected campus, ties use existing order, FTI remains last and campus picker stays outside sorting. Device/browser-local only, no backend/analytics calls. Clear storage key to reset.


### 2026-10-23 — Preserve searched room floor on building entry
`UrfuNavigator-web`: useInstituteBuilding initialization considers the ordinary-search focus before route endpoints/default floor. A matching building and valid floor ID are required; unrelated focus is ignored. This prevents floorReset(first) from overriding useSelectPoint after home search. Initialization guard still permits manual floor changes afterward; GPS priority remains lower. Added browse/route/unrelated-focus regression scenarios.


### 2026-10-23 — Default route origin from current building entrance
`UrfuNavigator-web`: selecting To while viewing /institute/:slug asynchronously queries explicit Exit points on floor numbered 1 of the source/viewed building. Empty From fills with main-named entrance, otherwise stable ID choice. Home selection never autofills; existing manual From is preserved. Source captured before destination navigation. Route revision guard discards stale responses after manual changes, clear or destination changes. Missing entrance/floor/network failure leaves From empty. Applies to room Сюда and route endpoint search; destination floor is unchanged. No backend writes.


### 2026-10-24 — Completed route replaces the main panel
`UrfuNavigator-web`: incomplete route remains an independent builder overlay. With both endpoints present and search finished, app presentation coordinator closes the overlay and marks routeDocked; main panel renders compact route fields in its normal footprint, keeping underlying page content. Editing an endpoint reopens search overlay; completion returns to docked route. Header Back clears route and restores normal panel. Mobile browser Back from docked route clears route and prunes builder/search history; nested overlays/search close first. Route docking does not expand panel to 90% or auto-collapse from map interaction. Added sidebar/history regressions.


### 2026-10-24 — Inline route endpoint search
`UrfuNavigator-web`: activating route From/To edits that field in place with autofocus; other endpoint remains visible. RoutePanel owns inline categories/history and results for both builder overlay and docked main panel. Docked endpoint editing no longer opens a modal; routeContent is independent of routeOpen. Mobile docked panel expands for results and settles after selection. QuickTypes expandable=false removes all-categories action and end-pull gesture; category choice preserves route direction/endpoints. Escape/header Back/system Back finish search before resetting route. Supersedes earlier separate endpoint-search overlay design. Shared general search remains unchanged.


### 2026-10-24 — Figma route editor 2900:1776
`UrfuNavigator-web`: route fields move into shared white header with 6px gap, 40px inputs, exact 10px dot asset 95bdb.svg and existing 20px clear icons. Body contains only history or search results; route categories removed entirely. No visible Route heading in expanded mobile editor. Docked mobile route settles at standard 80px search-only panel, showing destination summary with search icon and Back/reset control; activate row to edit. Expanded header uses both editable fields. Endpoint clear preserves opposite point and stays in editor. Figma session 614225e6-233d-4974-bb98-c98a93ed43d4; reference map imagery remains dynamic, not a design screenshot asset.


### 2026-10-24 — Пустая панель маршрута
В полях маршрута удалены SVG-точки. Крестик отображается только при видимом содержимом поля (запрос при редактировании, выбранная точка в остальном состоянии). При открытии пустого маршрута панель ограничена заголовком с двумя полями, история не монтируется. Активация поля раскрывает поиск с историей; завершение поиска без выбранных точек возвращает компактную высоту. Используются существующие состояния routeContent и общий свайп модальных панелей.


### 2026-10-24 — Известная проблема: поиск аудитории с разделителем и без него
Статус: открыта, зафиксирована со слов пользователя; причина и уровень возникновения (web/API) пока не установлены.

- При вводе обозначения аудитории через дефис или пробел (например, `р-202` или `р 202`) поиск показывает отсортированный список нерелевантных аудиторий корпуса вместо релевантных совпадений.
- При вводе того же обозначения слитно, без пробела или дефиса (например, `р202`), аудитории не находятся вообще.
- Ожидаемое поведение: варианты обозначения с дефисом, пробелом и без разделителя должны находить одну и ту же аудиторию; выдача должна соответствовать введённому корпусному префиксу и номеру.
- Для проверки исправления сравнить выдачу для `р-202`, `р 202` и `р202` при одинаковой области поиска и наличии соответствующей аудитории в данных. Перед исправлением проверить формируемый web-запрос и ответ API, не предполагая заранее источник дефекта.

В рамках этой записи код поиска не менялся; исправление и повторная проверка ещё не выполнены.


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
