<div align="center">
  <h1>
    drawflux
  </h1>
  <p><strong>A whiteboard web app</strong></p>
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

# Local development

### Requirements

[PostgreSQL 15](https://www.postgresql.org/download/)

### Install

Clone the repository to your local machine.

Install dependencies:

```bash
pnpm install
```

### Development Mode

Make sure to build packages before starting the development mode:

```bash
pnpm packages:build
```

Run client and server in development mode:

```bash
pnpm dev:app
```

You can find the rest of the scripts below.

# Monorepo Essentials

## Structure

```
├── apps
│   ├── client (react codebase)
│   └── server (express api)
└── packages
    ├── eslint-config-bases (eslint configs)
    └── shared              (utils, types, schemas, themes)
```

## Scripts

Some handy scripts that can be run from any directory.

| Name                      | Description                                          |
| ------------------------- | ---------------------------------------------------- |
| `pnpm dev:app`            | Run server and client in dev mode with --stream flag |
| `pnpm dev:client`         | Run react client in dev mode                         |
| `pnpm dev:server`         | Run express server in dev mode                       |
| `pnpm g:build`            | Run build in all workspaces                          |
| `pnpm g:test`             | Run tests in all workspaces                          |
| `pnpm g:typecheck`        | Run typechecks in all workspaces                     |
| `pnpm g:lint`             | Display linter issues in all workspaces              |
| `pnpm g:fix-all-files`    | Attempt to run linter auto-fix in all workspaces     |
| `pnpm packages:build`     | Build all packages workspaces                        |
| `pnpm packages:lint`      | Display packages linter issues                       |
| `pnpm packages:typecheck` | Run packages typechecks                              |
