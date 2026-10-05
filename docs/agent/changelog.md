# Agent changelog

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
