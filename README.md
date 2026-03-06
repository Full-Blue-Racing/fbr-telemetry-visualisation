```
______ ____  _____    _______   _                     _
|  ____|  _ \|  __ \  |__   __| | |                   | |
| |__  | |_) | |__) |    | | ___| | ___ _ __ ___   ___| |_ _ __ _   _
|  __| |  _ <|  _  /     | |/ _ \ |/ _ \ '_ ` _ \ / _ \ __| '__| | | |
| |    | |_) | | \ \     | |  __/ |  __/ | | | | |  __/ |_| |  | |_| |
|_|    |____/|_|  \_\    |_|\___|_|\___|_| |_| |_|\___|\__|_|   \__, |
                                                                 __/ |
                                                                |___/
```

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

## Contributing

Please keep AI generated code in contributions to a minimum.
If AI is used to generate **ANY** code, you **MUST** follow the scheme below to indicate this:

- If an AI model was used to generate less than 30% of the code, you must include `Assisted-by: Model name` in the commit message.
- If an AI model was used to generate 30% or more of the code, you must include `Co-authored-by: Model name` in the commit message.
- If an AI model was used to generate 100% of the code, you must include `Generated-by: Model name` in the commit message.

## TODO

- [ ] GPS visualisation
  - [ ] OpenStreetMap map ([leaflet.js](https://github.com/PaulLeCam/react-leaflet))
  - [ ] Route tracing
  - [ ] Link from point on map to other telemetry close in time
- [ ] Split screens ([React split-pane](https://github.com/tomkp/react-split-pane))
- [ ] Export each metric separately from fat CSV ([node-csv](https://github.com/adaltas/node-csv?tab=readme-ov-file))
- [ ] Graphs ([Chart.js](https://github.com/reactchartjs/react-chartjs-2))
  - [ ] Export graph to image
  - [ ] Strain gauges
  - [ ] Acceleration
  - [ ] Speed
    - [ ] From GPS
    - [ ] Integral of acceleration
