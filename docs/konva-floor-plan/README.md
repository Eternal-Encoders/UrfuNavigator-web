# `@eternal-encoders/konva-floor-plan`

React component that draws a building floor on a Konva stage: rooms, services, an optional route, an optional graph, and an optional GPS marker.

It takes data as props. It does not fetch, save, or read application state. Pass `editor` only in an app that edits the map. Leave it unset for a view-only map.

Published on GitHub Packages as `@eternal-encoders/konva-floor-plan`.

## Install

```
@eternal-encoders:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

`NODE_AUTH_TOKEN` is a GitHub token with `read:packages`. Install the package and these peers: `react`, `react-dom`, `konva`, `react-konva`, `use-image`.

```tsx
import { FloorPlan } from '@eternal-encoders/konva-floor-plan';

<FloorPlan
    floor={{ width, height, rooms, services }}
    schemes={colorSchemes}
    theme="light"
    viewport={{ width: viewportWidth, height: viewportHeight }}
    onRoomSelect={(pointId) => { /* app opens that point */ }}
/>
```

Agent context for this library is in [context.md](context.md).
