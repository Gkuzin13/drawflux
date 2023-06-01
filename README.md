<div align="center">
  <h1>
    drawflux
  </h1>
</div>

![drawflux web app screenshot](./assets/screenshot.png)

# Features

- Selection of tools - rectangle, ellipse, arrow, free-draw, text.
- Customizable shape style - color, size, opacity, line style, animation.
- Zoom and panning.
- History undo / redo.
- Shareable read-only links.
- Export to PNG / JSON.
- Offline support.

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

# Usage

## Install

```bash
pnpm install
```

## Monorepo scripts

Some handy scripts that can be run from any directory

| Name                      | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `pnpm dev:app`            | Run both server and client in dev mode with --stream flag |
| `pnpm g:build`            | Run build in all workspaces                               |
| `pnpm g:test`             | Run tests in all workspaces                               |
| `pnpm g:typecheck`        | Run typechecks in all workspaces                          |
| `pnpm g:lint`             | Display linter issues in all workspaces                   |
| `pnpm g:fix-all-files`    | Attempt to run linter auto-fix in all workspaces          |
| `pnpm packages:build`     | Build all packages workspaces                             |
| `pnpm packages:lint`      | Display packages linter issues                            |
| `pnpm packages:typecheck` | Run packages typechecks                                   |
