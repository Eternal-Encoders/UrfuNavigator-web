# Documentation audit — 2026-10-22

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

- `pnpm test`: 24 automated tests (compass, search/selection/categories, haptic dispatch, carousel end-pull and history controller).
- `pnpm build`: TypeScript and Vite production build.
- `pnpm lint`: FSD checker and full ESLint, no warnings allowed.
- `git diff --check`: whitespace validation.
- `pnpm install --frozen-lockfile --ignore-scripts`: lockfile/install consistency.
- Active archive: 28 dist/README files match renderer checkout byte-for-byte; packed package manifest matches after pnpm removes packageManager. Source commit: 75709efe3bbd7f2b0264c937e0ea6507f47a6f81.

Build may report third-party `use client` directive warnings; pnpm reports existing peer/auth configuration warnings. No registry credential was added. Historical performance numbers are not remeasured or presented as current results.

## Limits requiring device/production verification

See the full [known-limit list](current-state.md). In particular, automated tests cannot verify physical vibration/compass, Safari native permission UI, Android hardware Back with keyboard, real mobile gesture feel, or server production behavior. Empty campus content and pending Yandex API 3 migration are intentional unfinished scope, not undocumented features. No deployment/publication is included.
