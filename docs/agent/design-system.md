# Design system

Stack: Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui (style `radix-vega`,
Radix primitives via the `radix-ui` package), `lucide-react` icons,
`tw-animate-css` for enter animations. There is no SCSS/CSS-modules anymore;
all styling is Tailwind utility classes.

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
| `background`                        | `#f4f6fb` | `#0f1115` | App background                       |
| `foreground`                        | `#1f2937` | `#f3f6fc` | Primary text                         |
| `card` / `popover`                  | `#fcfcfc` | `#171a21` | Panels, drawers                      |
| `secondary` / `muted`               | `#eef2f8` | `#232833` | Elevated controls, sections          |
| `accent`                            | `#e3e8f2` | `#2a3140` | Hover surfaces                       |
| `muted-foreground`                  | `#5b6472` | `#c2cad8` | Secondary text                       |
| `subtle-foreground`                 | `#9aa3b2` | `#8691a3` | Placeholders, drag handle            |
| `primary`                           | `#1d4ed8` | `#3b82f6` | Active floor, active language, switch|
| `destructive`                       | `#dc2626` | `#ef4444` | Errors                               |
| `success` / `warning` / `info`      | green / amber / blue | | Status                          |
| `border` / `input`                  | `#e2e8f0` / `#cbd5e1` | `#2e3545` / `#3e475b` | Borders  |
| `ring`                              | blue 500  | blue 300  | Focus ring                           |
| `route`                             | `#95ba9f` | same      | Floor "on the way" ring              |
| `shadow-subtle/soft/elevated`       |           |           | Control / panel / drawer shadows     |
| `radius` (`rounded-sm…4xl`)         | `0.75rem` base |      | `lg` = 12px, `xl` ≈ 17px            |

Layout variables: `--panel-width` (side panels, `w-(--panel-width)`),
`--keyboard-offset` and `--mobile-drawer-offset` (set from JS, used for
bottom positioning on phones).

Breakpoint: `desktop:` = `min-width: 75.0625rem` (1201px), mirroring
`PHONE_BREAKPOINT = 1200` in `shared/config`. Base styles are phone styles.

Fonts: Inter Variable (UI, `font-sans`), Roboto (Konva canvas text, `font-map`).

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
- `features/point-search`: `SearchTrigger`, `SearchBar`, `SearchResults`, `QuickTypes`.
- `features/select-floor`: `FloorSwitcher`.
- `features/user-location`: `GpsToggle`.
- `features/change-theme`: `ThemeSwitch`. `features/change-language`: `LanguageSwitcher`.
- `widgets/side-menu`: `SideMenu` (+ internal `SideMenuHeader`, `SideMenuBody`,
  `InstitutesList`, `SettingsPanel`).
- `widgets/point-details`: `PointDetails`.
- `widgets/floor-map`: `FloorMap`, `FloorMapSkeleton` (shown while the selected floor has no resolved data).
