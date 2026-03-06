# FBR Telemetry Visualisation

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Start the dev server, and the visualiser will be available at [http://localhost:3000](http://localhost:3000).

```bash
pnpm run dev
```

To build for production:

```bash
pnpm run build
```

Preview the production build locally:

```bash
pnpm run preview
```

## TODO

- [ ] GPS visualisation
  - [ ] OpenStreetMap map
  - [ ] Route tracing
  - [ ] Link from point on map to other telemetry close in time
- [ ] Export each metric separately from fat CSV
- [ ] Graphs
  - [ ] Export graph to image
  - [ ] Strain gauges
  - [ ] Acceleration
  - [ ] Speed
    - [ ] From GPS
    - [ ] Integral of acceleration
