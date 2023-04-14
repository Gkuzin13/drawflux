<div align="center">
  <h1>
    drawflux
  </h1>
</div>

<div align="center">
  <h2>
    A drawing app
  </h2>
</div>

# Features

- Selection of tools - rectangle, ellipse, arrow, free-draw, text.
- Customizable shape style - color, size, line-style, animation.
- Export to PNG / JSON.
- Undo / Redo.
- Zoom and panning.

# Structure

This repository is a monorepo:

```
├── apps
│   ├── client (react codebase)
│   └── server (the api)
└── packages
    ├── eslint-config-bases (shared eslint configs)
    └── shared              (shared utils, types, schemas, themes)
```
