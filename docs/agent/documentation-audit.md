# Documentation audit — 2026-10-24

## Coverage and corrections

- Added [current-state index](current-state.md) mapping each delivered flow to its source, runtime behavior and known limitations. Dated implementation history remains in changelog/architecture.
- Updated root README to the actual 1.4.0 vendor dependency, working pnpm test/build/lint commands, preview/LAN instructions, runtime configuration precedence, separate overlays and active admin icons.
- Corrected current text-fade policy to 0.75 / 3–6px; corrected library contract references. The [override registry](map-overrides.md) explicitly lists affected admin fields, precedence, theme values and restoration instructions.
- Vendor README records the exact renderer source commit and archive SHA-256. All archived dist files are compared against the library build; lockfile integrity is refreshed after repack.
- Asset README now distinguishes inactive photographs/facades from active admin icons. Font license notices are retained.
- Removed unused API 3 type and SWC plugin dependencies. Campus map remains on API 2.1; API 3 is unfinished and not claimed as delivered.
- All four locale JSON files parse and have the same 59 keys. Relative Markdown links in docs/README resolve in the sibling checkout layout. Cross-repository relative links require that layout; they are local context links, not standalone GitHub URLs.
- Checked candidate text files for common GitHub/AWS credential/private-key patterns; none matched. Ignored .env.local, node_modules, dist, logs and workspace screenshots are not part of commits. This is a scoped pattern check, not a comprehensive security review.

## Validation

- `pnpm test`: 56 automated tests (compass, search/selection/categories, haptic dispatch, carousel end-pull and history controller).
- `pnpm build`: TypeScript and Vite production build.
- `pnpm lint`: FSD checker and full ESLint, no warnings allowed.
- `git diff --check`: whitespace validation.
- `pnpm install --frozen-lockfile --ignore-scripts`: lockfile/install consistency.
- Active renderer archive: 1.13.0; dist parity, SHA-256 and exact source revision are recorded in vendor/README.md.

Build may report third-party `use client` directive warnings; pnpm reports existing peer/auth configuration warnings. No registry credential was added. Historical performance numbers are not remeasured or presented as current results.

## Limits requiring device/production verification

See the full [known-limit list](current-state.md). In particular, automated tests cannot verify physical vibration/compass, Safari native permission UI, Android hardware Back with keyboard, real mobile gesture feel, or server production behavior. Campus selection now contains cards/filtering; unavailable campuses remain disabled. Yandex API 3 migration is pending. Route UX is unfinished: see [route-ux.md](route-ux.md). No deployment/publication is included.


## Current delivery audit
Both repositories have separate local commits; no push, package publication or deployment is included. Library tests: 45; web tests: 56. Current route rules and superseded historical descriptions are reconciled in route-ux.md and the current-state index. Historical renderer archives and unused 95bdb.svg are retained; only 1.13.0 is active. Android/Safari device acceptance is pending.
