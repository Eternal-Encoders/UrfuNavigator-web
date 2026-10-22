# Floor-plan package provenance

Active dependency: @eternal-encoders/konva-floor-plan 1.4.0
Archive: eternal-encoders-konva-floor-plan-1.4.0.tgz
Source: https://github.com/Eternal-Encoders/konva-floor-plan
Local checkout: ../konva-floor-plan (sibling of this web repository)
Branch: feat/map-label-rotation
Source commit: 75709efe3bbd7f2b0264c937e0ea6507f47a6f81
Upstream base revision: 9cc201e6a4e23524a9935bc0463913202cd9ed33

The archive includes the renderer source changes documented below (local package, not registry-published): library-owned rotation, release snapping, dots/lines background, gesture fixes and opt-in adaptive upright annotations with public configuration props. See the library docs/agent/changelog.md. It includes package.json, README and the built dist bundle/declaration tree; React/Konva peers remain external. Historical 1.0.0/1.1.0 archives are retained but inactive.

To rebuild after library changes:

1. In the library checkout, run `pnpm install`, `pnpm test`, `pnpm build`.
2. Run `pnpm pack --pack-destination ../UrfuNavigator-web/vendor`.
3. In web run `pnpm update @eternal-encoders/konva-floor-plan` to refresh tarball integrity in pnpm-lock.yaml, then `pnpm build` and `pnpm lint`.
4. Commit the matching source, archive and lockfile changes in their respective repositories. Do not replace an archive without refreshing the lockfile.

The library now uses Vite 8's built-in JSX transform, without a separate native SWC transform plugin. The local archive avoids requiring GitHub Packages credentials and is not a registry publication.

Active archive SHA-256: `e21203c2a16f54a11822025ba6cdbf579f03a669fa2d494436d420b4ee410144`.

Includes optional fadeThresholdMultiplier (default 1); navigator overrides text to 0.75, effective fade 3–6px.

Development cache: the renderer is explicitly prebundled with force enabled to preserve React JSX runtime interop. After refreshing a local tarball/install, restart Vite; do not exclude the renderer from optimization (this caused a missing jsxs export and blank building page).
