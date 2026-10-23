# UrfuNavigator web

React / TypeScript campus and indoor navigator. The responsive interface follows the Figma section HOW-TO-NAVIGATE: REMAKE:
https://www.figma.com/design/T7qxHGOyIyon8zbbUUt3pp/UI?node-id=2668-1550

## Local development

```powershell
pnpm install --frozen-lockfile
# Create .env.local with one of the following values:
# VITE_HOST=/backend                       # development proxy to the test API
# VITE_HOST=http://127.0.0.1:5000           # your own Go API
pnpm dev
```

Open http://localhost:3000. The development proxy forwards /backend to https://api.test.how-to-navigate.ru. This runs the web client locally with remote test data; it does not start MongoDB, MinIO, or the Go service. With no VITE_HOST, development uses the local API on port 5000. The runtime config.js value takes precedence when set.

The app uses Vite's built-in JSX transformation. No native SWC binding is required.

## Validation

```powershell
pnpm build
pnpm lint
pnpm test
```

The lint command checks FSD boundaries and ESLint. Tests exercise gestures, haptics, panel history, search selection and compass calculations; hardware behavior still needs real-device verification.

## Floor-plan dependency

The published floor-plan package requires GitHub Packages authentication. For reproducible local installation, vendor/eternal-encoders-konva-floor-plan-1.6.0.tgz contains the built local renderer from the sibling konva-floor-plan repository. No access token is needed. See vendor/README.md for provenance.

## Interface

Desktop: a fixed 356 px sidebar with expanded building rows. Mobile/tablet: a bottom panel with a draggable handle, horizontally scrolling building/category cards, search results, recent places, language settings, and route endpoints. Recent places stay in browser local storage. Only buildings supplied by the API are selectable; the design's extra buildings are not fabricated.

The settings screen supports Russian, English, Chinese, and Arabic. Settings and the currently empty campus selector open as independent modal overlays. Map plans, room names, graph points, and routes remain API-driven.

Static design icons and building photos are in public/remake. They were downloaded from the supplied Figma design. Golos UI and Ruda are included locally under the SIL Open Font License; notices are in the same folder. Building cards currently render admin-provided icons at 75% of their 100px media slot; photographic assets and vector facade code remain inactive.

## Preview and phone access

```powershell
pnpm build
pnpm preview --host 0.0.0.0 --port 4174
```

Development listens on port 3000 and all interfaces by default. From a phone on the same LAN, use the computer's current IPv4 address with :3000 or :4174. Preview reads dist and must be rebuilt after source changes. Device compass requires a trusted secure context; plain LAN HTTP does not provide it.

## Current implementation and limitations

Read [current state](docs/agent/current-state.md), [map override registry](docs/agent/map-overrides.md) and [documentation audit](docs/agent/documentation-audit.md). The dated changelog and performance report retain historical measurements and superseded intermediate decisions.

The campus map still uses Yandex Maps API 2.1. API 3 migration is pending a configured JavaScript API key and is not included in this implementation. Indoor maps use the local Konva renderer.
