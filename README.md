<div align="center">
  <h1>
    drawflux
  </h1>
</div>

![drawflux web app screenshot](./assets/screenshot.png)

# Features

- Selection of tools - rectangle, ellipse, arrow, free-draw, text.
- Customizable shape style - color, size, line-style, animation.
- Zoom and panning.
- Undo / Redo.
- Shareable read-only links.
- Export to PNG / JSON.

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
