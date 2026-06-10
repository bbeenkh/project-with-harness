# pnpm Monorepo Boilerplate — Design Spec

**Date:** 2026-06-10
**Status:** Approved

## Overview

Empty boilerplate monorepo using pnpm workspaces with a React+Vite frontend and a Hono+lowdb backend, both in TypeScript.

## Folder Structure

```
project-with-harness/
├── apps/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   └── App.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   └── backend/
│       ├── src/
│       │   ├── index.ts
│       │   └── db.ts
│       ├── db.json
│       ├── tsconfig.json
│       └── package.json
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

## Stack

| Layer | Tech |
|-------|------|
| Package manager | pnpm workspaces |
| Frontend | React 19 + Vite 6 + TypeScript |
| Backend | Hono + tsx + TypeScript |
| JSON DB | lowdb v7 (file-based, ESM) |

## Ports

- Frontend dev server: `5173` (Vite default)
- Backend dev server: `3000`

## Root Scripts

| Command | Action |
|---------|--------|
| `pnpm dev` | Start frontend + backend concurrently |
| `pnpm build` | Build all apps |
| `pnpm -F frontend dev` | Frontend only |
| `pnpm -F backend dev` | Backend only |

## Key Decisions

- **lowdb v7**: ESM-native, zero dependencies, file-based — ideal for a JSON DB boilerplate
- **tsx**: Fast TS execution for backend dev without a build step
- **tsconfig.base.json**: Shared compiler options extended by each app
- **concurrently**: Used at root level to run both dev servers with a single `pnpm dev`
