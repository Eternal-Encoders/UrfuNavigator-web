# Design system

Stack: Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui (style `radix-vega`,
Radix primitives via the `radix-ui` package), `lucide-react` icons,
`tw-animate-css` for enter animations. There is no SCSS/CSS-modules anymore;
styling uses Tailwind utilities, with semantic REMAKE selectors composed via `@apply`.
Custom CSS remains for font declarations, tokens, precise photo crops, scrollbar
behavior and a few effects. Generated shadcn primitives are unchanged.

Global stylesheet: `src/app/styles/index.css` (also the `tailwind.css` entry in
`components.json`).

## Adding shadcn components

```
pnpm dlx shadcn@latest add <component>
```

`components.json` aliases put components in `@/shared/ui` and utils in
`@/shared/lib/utils`. Known CLI quirk: it may write `import { cn } from "cn"`
and add the `cn` npm package. Replace it with
`import { cn } from "@/shared/lib/utils"` and `pnpm remove cn`. Then export the
component from `src/shared/ui/index.ts` and add the file to the shadcn
override block in `eslint.config.js`.

Do not edit generated primitives; compose them in entities/features/widgets.

## Tokens

Defined as CSS variables on `:root` (light) and `.dark` (dark), mapped to
Tailwind colours in `@theme inline`. Dark mode = `.dark` class on `<html>`
(set by `app/model/useAppEnvironment.ts`, persisted in `localStorage.theme`).

| Token (utility)                     | Light     | Dark      | Use                                  |
|-------------------------------------|-----------|-----------|--------------------------------------|
| `background`                        | `#f0f2f5` | `#0f1115` | App background                       |
| `foreground`                        | `#262626` | `#f3f6fc` | Primary text                         |
| `card` / `popover`                  | `#fff` / `#fcfcfc` | `#171a21` | Panels, drawers                      |
| `secondary` / `muted`               | `#f0f2f5` | `#232833` | Elevated controls, sections          |
| `accent`                            | `#e3e8f2` | `#2a3140` | Hover surfaces                       |
| `muted-foreground`                  | `#60636c` | `#c2cad8` | Secondary text                       |
| `subtle-foreground`                 | `#9d9d9d` | `#8691a3` | Placeholders, drag handle            |
| `primary`                           | `#1d4ed8` | `#3b82f6` | Active floor, active language, switch|
| `destructive`                       | `#dc2626` | `#ef4444` | Errors                               |
| `success` / `warning` / `info`      | green / amber / blue | | Status                          |
| `border` / `input`                  | `#e2e8f0` / `#cbd5e1` | `#2e3545` / `#3e475b` | Borders  |
| `ring`                              | blue 500  | blue 300  | Focus ring                           |
| `route`                             | `#95ba9f` | same      | Floor "on the way" ring              |
| `shadow-subtle/soft/elevated`       |           |           | Control / panel / drawer shadows     |
| `radius` (`rounded-sm…4xl`)         | `0.75rem` base |      | `lg` = 12px, `xl` ≈ 17px            |

Layout variables: `--panel-width` (side panels, `w-(--panel-width)`),
`--viewport-height` and `--viewport-top` (stable layout root geometry),
`--visible-viewport-height` (scrollable content area above the keyboard), and
`--mobile-drawer-offset` (map controls above the phone drawer). There is no separate
keyboard bottom offset. Mobile search inputs use 16px text to avoid Safari focus zoom.

Breakpoint: `desktop:` = `min-width: 75.0625rem` (1201px), mirroring
`PHONE_BREAKPOINT = 1200` in `shared/config`. Base styles are phone styles.

Fonts: Golos UI (UI, `font-sans`, Inter Variable fallback), Roboto (Konva canvas,
`font-map`), Ruda (floor controls/footer, `font-ruda`). REMAKE fonts, photos and SVG
assets are local files under `public/remake/`. `--panel-width` is 356px; controls are 40px.

Konva canvas colours (room text, route line `#54B235`, GPS marker) are hex
values in `widgets/floor-map` because canvas cannot read CSS variables;
building colours come from the API colour schemes (`lib/mapColors.ts`).

## Components

`shared/ui`:

- `Button` (shadcn): variants `default | outline | secondary | ghost | destructive | link`,
  sizes `default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg`. Icon buttons in the
  app use `size="icon-lg"` + `variant="outline"` (or `ghost` inside the search bar).
- `Input` (shadcn), `Switch` (shadcn, Radix), `Separator` (shadcn, Radix).
- `Panel`: rounded card surface, `elevated` adds `shadow-subtle`.
- `DragHandle`: bar shown at the top of mobile drawers.

Composed components:

- `entities/building`: `BuildingLink` (institute tile), `BuildingRedirect` (building name badge/link).
- `features/point-search`: `SearchTrigger`, `SearchBar`, `SearchResults`, `QuickTypes`, `SearchHistory`.
- `features/select-floor`: `FloorSwitcher`.
- `features/user-location`: `GpsToggle`.
- `features/change-theme`: `ThemeSwitch`. `features/change-language`: `LanguageSwitcher`.
- `widgets/side-menu`: `SideMenu` (+ internal `SideMenuHeader`, `SideMenuBody`,
  `InstitutesList`, `SettingsPanel`, `RoutePanel`).
- `widgets/point-details`: `PointDetails`.
- `widgets/floor-map`: `FloorMap`, `FloorMapSkeleton` (shown while the selected floor has no resolved data).

REMAKE layout: desktop building/category grid has three 100px columns; on mobile,
cards form horizontal scrolling rows. Language settings support ru/en/zh/ar; additional
settings keep the existing theme and contact controls. Panel animation is 180ms ease-out,
disabled while dragging and reduced under `prefers-reduced-motion`.

Mobile search input: `.small-input` keeps computed font-size 16px for Safari and uses
`transform: scale(0.875)` around `left center`. Width and height compensate for the scale
inside `.small-input-frame`, preserving the visible 14px placeholder/text and 24px text area.
The enclosing search control owns the focus ring. Desktop input styling is unchanged.

Expanded mobile campus cards: Figma node 2877:2911. A 90%-height panel uses the existing 80px
header. `.building-list.is-detailed` is a vertical list with 8px gaps; rows are 100px high and
fill the body width (361px at a 393px viewport). Photo slot stays 100x100 with the same crop.
Details use 12px Golos UI, 5px gaps, padding 12px 16px, secondary name color and subtle full-name /
address color. Header assets are local 7b59f.svg (24x24 search), f17f3.svg (20x20 close) and
3a06c.svg (24x4 handle). Morphing follows the gesture continuously; the post-release height driver uses up to 260ms ease-out.
The compact 100x132 cards and desktop grid retain their existing geometry.

Campus motion uses a shared continuous progress: card dimensions interpolate 100x132 -> available
width x100, corner radius follows an 8px -> 12px -> 8px arc, and row/title paths have distinct phases.
Newly visible cards fade in by index; titles crossfade during relocation, and details fade/translate
later in the gesture. Icon wrappers rotate/crossfade without changing SVG root dimensions. At progress
0 and 1 the existing compact and Figma 2877:2911 detailed geometry is preserved.


## Settings — Figma 2699:1620 (2026-10-22)

The mobile settings header is 80px with a centered 14px title and close control. Sections use 24px labels, 16px separation, .5px card borders, and soft shadows. Language selection is a 188px four-row card with centered labels; theme choices and external links are 47px high. All settings are visible without a disclosure. The theme feature composes shadcn Buttons with aria-pressed and existing Redux actions. External links use the exact 12×12 `5c1d5.svg` asset. The Ruda footer follows the content; at 393×852 it fits without scrolling, and shorter screens scroll the body while keeping the header visible.


## Loading placeholders (2026-10-22)

Shared Skeleton blocks use the current secondary/card palette and one 3.2s horizontal shimmer. MapSkeleton represents a floor/map surface; ListSkeleton represents result/detail rows; the building widget composes compact or expanded card placeholders. Groups expose a localized loading status and aria-busy; individual shapes are hidden from assistive technology. Reduced-motion makes them static. Existing content remains during background/paginated fetching; placeholders never impose a minimum waiting period.


## Floor map background — dots and lines (2026-10-22)

Approved mixed pattern uses roughly 24px dot spacing with major grid lines every five dots. Dot diameter is 1.6px at 12% opacity, lines are 1px at 5.4%; inks are rgb(65 76 94) in light mode and rgb(210 222 239) in dark mode. Map and panel share --background: #f4f5f7 / #0f1115. Geometry is anchored to the stage and adapts its density in powers of two on zoom; rooms and routes stay above the background. This affects institute floor plans, not the Yandex campus map.


### Compass needle

A 30×36px inline SVG in a 40×40px pointer-events-none slot, 8px above GPS. Red faceted forward tip (#F43E44/#C92C37), gray reverse tip (#D9DCE3/#9296A2). Transparent: no button surface, border, circle or shadow. It inherits actions visibility and is hidden without calibrated floor and a valid permitted compass reading.


### Text selection

Page and portal text uses user-select: none, with the WebKit prefix. Inputs, textareas and contenteditable regions keep user-select: text for editing. This is an interaction policy, not a change to typography or clipboard permissions.


### Desktop building catalog

Above 1200px, building cards always use the expanded appearance: one column, full panel width, 100px row/photo height, 8px row gap, and full name/address beside the photo. Loading placeholders use the same expanded row layout. Mobile retains its continuous carousel-to-list morph.


Building catalog icons use a centered 75×75px image within the 100×100px media slot (75% width/height, 12.5% top/left insets), with object-fit contain. Applies to desktop and mobile cards.


Category and building card shadows match: 0 0 10px rgb(0 0 0 / 4%) normally; 0 2px 14px rgb(0 0 0 / 4%) on hover, in both themes.


Expanded category grid: repeat(auto-fill, minmax(min(100%, 100px), 1fr)), fixed 8px gaps. Columns stretch equally to consume available width; cards and the toggle fill their column while retaining 132px height. Incomplete rows share column alignment. Compact mobile categories remain a horizontal carousel.


Category end-pull motion: list offset is -32 × progress / (progress + 0.5) px, about -21px at full indicator progress. On incomplete release, shared ring/offset progress returns to zero over 260ms cubic ease-out; reduced-motion uses immediate reset.


The circular All/Fewer categories button surface also uses 0 0 10px rgb(0 0 0 / 4%) in both themes.


Room details now share the settings/campus modal shell: background surface, card header, 14px title, 40px close button, 90% mobile height and fixed desktop sidebar width. Sections use 12px muted labels and 14px card content; route actions are 47px high. Schedule rows align values to inline end. Data remains visible during the close animation.


Room panel refinement: use the same /remake/3a06c.svg handle and button as settings, omit Institute section, and allow user-select text within room details except buttons. Full-surface swipe is shared with settings, yielding to existing text selection and body scrolling.


### 2026-10-23 — Search-only room preview
- Repository: `UrfuNavigator-web`. Search-origin room details collapse to the measured header and route buttons, including body padding; the previous information-section teaser is removed.
- `previewEnabled` records the entry scenario independently of the retained map focus. A direct map selection always opens full details and disables the preview, including when selecting the same room after search. Shared settings swipe dismisses this panel directly.
- Mobile panel history restores the entry scenario and collapsed state together. Reducers reject collapse for map-origin details.
- No map rendering or admin-data overrides were added.


### 2026-10-23 — Preview dimensions available before paint
Room preview no longer measures loaded sections. Desktop height is 151px, mobile 175px (extra 24px handle); both include 47px route actions and shared padding. Upward swipe adds its live offset to this base. Expand via handle/swipe, not body click.


### 2026-10-23 — Hide information sections in compact room details
`UrfuNavigator-web`: compact preview explicitly hides body children other than route actions, so section headings such as Type cannot appear in the bottom padding. Visibility preserves layout for the shared expansion gesture; full details retain selectable content.


### 2026-10-23 — Compact room panel ends at route buttons
`UrfuNavigator-web`: removed the visibility override. Reduced compact height by the 16px body bottom padding: 135px desktop / 159px mobile. The viewport ends at the route buttons; subsequent sections retain their normal visibility and are clipped by the compact body overflow. This supersedes the prior 151/175px dimensions and hiding workaround.


### 2026-10-23 — Panel return and room-attached floor controls
`UrfuNavigator-web`: main panel and its actions fade/translate back over 180ms after room details close. Covered panels remain mounted and inert. Map controls fade instead of display:none. In mobile compact room details, floor controls anchor 8px above the visible room panel using shared --room-preview-height and live --room-panel-lift, ignoring hidden main-panel height/expanded state. Full room details hide map controls. Desktop floor controls retain their top placement; reduced motion disables transitions.


### 2026-10-23 — Floor-list overflow anticipation
`UrfuNavigator-web`: ResizeObserver compares the complete floor list with the space above the active panel. Hide with 160ms opacity/6px translation when less than 24px spare space remains; show again with at least 32px spare (8px hysteresis). Hidden controls are inert. Available space follows the panel without position easing; list is no longer clipped while fading. Reduced motion removes animation.


### 2026-10-23 — Five-row scrolling floor selector
`UrfuNavigator-web`: floor selector has at most five visible rows including ▲/▼ controls. Top/bottom indicators appear only when more floors remain in that direction, reserving one row each (three floor rows between two indicators). Native touch/wheel scrolling and clickable paging arrows; selected floor is brought into view after external floor changes. Rows remain 34px with 5px gaps. Overflow-fit observer measures this compact selector rather than every floor. Arrow labels localized ru/en/zh/ar.


### 2026-10-23 — Campus selection
`UrfuNavigator-web`: campus entity owns selected campus and focus request version. Independent expanded campus overlay now uses 100px institute-style cards with admin SVGs (Mira/GUK, Lenina/UGI, unavailable Novokoltsovsky/IRIT). Unavailable card disabled, grayscale icon, weak text and localized status. Existing shared full-panel mobile swipe and Back handling retained. Choosing an available campus closes overlay and centers Yandex map at zoom 15 (Mira original 56.842,60.652; Lenina 56.840429,60.616079) with 350ms move; repeated selection refocuses. No filtering of institute list, backend writes or map API migration. Selection lasts for current app session.


### 2026-10-23 — Explicit expanded building titles and descriptions
`UrfuNavigator-web`: building card metadata now has optional expandedTitle, distinct from compact label; no parentheses parsing. Expanded titles crossfade/translate with existing per-card detail progress during mobile expansion; desktop full list shows expanded title directly. GUK: ГУК (ГУК, Э, И, М); ISA: ИСА (С, СП); UralENIN: УралЭНИН (Т); INMIT/HTI: ИНМиТ / ХТИ (МТ, Х). Added user-provided ISA/UralENIN/INMIT full descriptions and addresses; retained GUK/IRIT details and explicit ИРИТ-РТФ (Р) expanded title. Local presentation metadata overrides API display name for these cards; remove expandedTitle/fullName/address entries to restore default labels/details. No API/admin writes or icon changes.


### 2026-10-24 — Figma route editor 2900:1776
`UrfuNavigator-web`: route fields move into shared white header with 6px gap, 40px inputs, exact 10px dot asset 95bdb.svg and existing 20px clear icons. Body contains only history or search results; route categories removed entirely. No visible Route heading in expanded mobile editor. Docked mobile route settles at standard 80px search-only panel, showing destination summary with search icon and Back/reset control; activate row to edit. Expanded header uses both editable fields. Endpoint clear preserves opposite point and stays in editor. Figma session 614225e6-233d-4974-bb98-c98a93ed43d4; reference map imagery remains dynamic, not a design screenshot asset.


## 2026-10-24 — Актуальный редактор маршрута
Два поля 40px с промежутком 6px, без точек; очистка видна при содержимом. Сложенный построенный маршрут также содержит оба поля, минимальная мобильная высота 126px вместо исторических 80px. Пустой редактор — только заголовок с полями, без истории. Иконка недавних мест — 8942d.svg (история), прежняя 95bdb.svg больше не используется. В редакторе нет отдельной стрелки «Назад», на десктопе есть крестик. UX требует доработки: см. [route-ux.md](route-ux.md).
