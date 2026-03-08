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
- [ ] Data deserialisation (flatbuffers, TBC)
- [ ] Split screens ([React split-pane](https://github.com/tomkp/react-split-pane))
- [ ] Export of metrics
  - [ ] CSV ([node-csv](https://github.com/adaltas/node-csv?tab=readme-ov-file))
  - Maybe other formats?
- [ ] Zooming to chosen part of graph
- [ ] Load each car start separately
- [ ] Graphs ([Chart.js](https://github.com/reactchartjs/react-chartjs-2))
  - [ ] Wheel speed sensors
    - [ ] Graph with 4 lines, one for each wheel
    - [ ] Graph with front sensors
    - [ ] Graph with back sensors
    - [ ] Graph for each wheel separately
  - [ ] Linear position sensors
    - [ ] Graph for all 4 position sensors
    - [ ] Graph for front dampers
    - [ ] Graph for back dampers
    - [ ] Graph for each damper separately
  - [ ] Export graph to image
  - [ ] Strain gauges
  - [ ] Acceleration
  - [ ] Speed
    - [ ] From GPS
    - [ ] Integral of acceleration
