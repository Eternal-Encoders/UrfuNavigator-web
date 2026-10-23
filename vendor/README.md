# Floor-plan package provenance

Active dependency: @eternal-encoders/konva-floor-plan 1.13.0
Archive: eternal-encoders-konva-floor-plan-1.13.0.tgz
Source: https://github.com/Eternal-Encoders/konva-floor-plan
Local checkout: ../konva-floor-plan (sibling of this web repository)
Branch: feat/map-label-rotation
Source commit: 5394a22757c52efce264241565974f518d6dc0a6
Upstream base revision: 9cc201e6a4e23524a9935bc0463913202cd9ed33

The archive includes the renderer source changes documented below (local package, not registry-published): library-owned rotation, release snapping, dots/lines background, gesture fixes and opt-in adaptive upright annotations with public configuration props. See the library docs/agent/changelog.md. It includes package.json, README and the built dist bundle/declaration tree; React/Konva peers remain external. Historical 1.0.0–1.12.0 archives are retained but inactive.

To rebuild after library changes:

1. In the library checkout, run `pnpm install`, `pnpm test`, `pnpm build`.
2. Run `pnpm pack --pack-destination ../UrfuNavigator-web/vendor`.
3. In web run `pnpm update @eternal-encoders/konva-floor-plan` to refresh tarball integrity in pnpm-lock.yaml, then `pnpm build` and `pnpm lint`.
4. Commit the matching source, archive and lockfile changes in their respective repositories. Do not replace an archive without refreshing the lockfile.

The library now uses Vite 8's built-in JSX transform, without a separate native SWC transform plugin. The local archive avoids requiring GitHub Packages credentials and is not a registry publication.

Active archive SHA-256: `46c45e72810086aa1ba315907f066db1faa3345ac36a9decf82fd50e42c4fc99`.

Includes optional fadeThresholdMultiplier (default 1); navigator overrides text to 0.75, effective fade 3–6px.

Development cache: the renderer is explicitly prebundled with force enabled to preserve React JSX runtime interop. After refreshing a local tarball/install, restart Vite; do not exclude the renderer from optimization (this caused a missing jsxs export and blank building page).

Includes 1.13.0 camera=false highlight-only focus and optional minScale focus zoom; source changes are committed on feat/map-label-rotation at the source revision above.

1.13.0 adds direct Konva paint transitions for selection, clearing selection and changed schemes/themes (220ms ease-out, reduced motion supported).

1.13.0 adds opt-in initialView, applied once per floor key before search focus.

1.13.0 exports floorContentView and adds initialView.scale for actual-geometry camera fitting.

1.13.0 adds initialCamera/onCameraChange/cameraKey for preserving view across floor remounts.

1.13.0 adds optional referenceFloor exterior outline (polygon-clipping bundled; no consumer import needed).

1.13.0 adds conservative stair-landmark floorAlignment and floorOffset registration of current geometry in reference coordinates.

1.13.0 includes lift/stair-icon landmark recognition with same-kind matching and three-anchor consensus.

Delivery verification (2026-10-24): all 35 dist files in the active archive match the source commit build byte-for-byte. The archive README reflects the package at packing time; subsequent agent audit notes are tracked in the source repository rather than repacked into a byte-identical archive.
