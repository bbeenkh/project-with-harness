# pnpm Monorepo Boilerplate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up an empty pnpm workspace monorepo with a React+Vite frontend and a Hono+lowdb backend, both in TypeScript.

**Architecture:** pnpm workspaces with two apps under `apps/`. A shared `tsconfig.base.json` at root is extended by each app. The root `package.json` runs both dev servers concurrently via a single `pnpm dev` command.

**Tech Stack:** pnpm workspaces, React 19, Vite 6, Hono 4, @hono/node-server, lowdb 7, tsx, TypeScript 5, concurrently

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Root — workspace scripts, concurrently dev runner |
| `pnpm-workspace.yaml` | Declares `apps/*` as workspace packages |
| `tsconfig.base.json` | Shared TS compiler options |
| `apps/frontend/package.json` | Frontend deps & scripts |
| `apps/frontend/vite.config.ts` | Vite config with React plugin |
| `apps/frontend/tsconfig.json` | Frontend TS config (extends base) |
| `apps/frontend/index.html` | HTML entry point |
| `apps/frontend/src/main.tsx` | React root mount |
| `apps/frontend/src/App.tsx` | Root App component |
| `apps/backend/package.json` | Backend deps & scripts |
| `apps/backend/tsconfig.json` | Backend TS config (extends base) |
| `apps/backend/src/index.ts` | Hono server entry, route definitions |
| `apps/backend/src/db.ts` | lowdb initialization & export |
| `apps/backend/db.json` | Initial empty DB file |

---

### Task 1: Root workspace files

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`

- [ ] **Step 1: Create root `package.json`**

```json
{
  "name": "project-with-harness",
  "private": true,
  "scripts": {
    "dev": "concurrently \"pnpm -F frontend dev\" \"pnpm -F backend dev\"",
    "build": "pnpm -r build"
  },
  "devDependencies": {
    "concurrently": "^9.0.0"
  }
}
```

- [ ] **Step 2: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - 'apps/*'
```

- [ ] **Step 3: Create `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  }
}
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules/
dist/
apps/backend/db.json
```

> Note: `db.json` is gitignored so dev data doesn't pollute the repo. Each app creates its own on first run.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-workspace.yaml tsconfig.base.json .gitignore
git commit -m "chore: add root workspace config"
```

---

### Task 2: Frontend app (React + Vite)

**Files:**
- Create: `apps/frontend/package.json`
- Create: `apps/frontend/vite.config.ts`
- Create: `apps/frontend/tsconfig.json`
- Create: `apps/frontend/index.html`
- Create: `apps/frontend/src/main.tsx`
- Create: `apps/frontend/src/App.tsx`

- [ ] **Step 1: Create `apps/frontend/package.json`**

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.7.2",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: Create `apps/frontend/vite.config.ts`**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create `apps/frontend/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `apps/frontend/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Create `apps/frontend/src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 6: Create `apps/frontend/src/App.tsx`**

```tsx
export default function App() {
  return <h1>Hello from React + Vite</h1>
}
```

- [ ] **Step 7: Commit**

```bash
git add apps/frontend/
git commit -m "feat: add React + Vite frontend app"
```

---

### Task 3: Backend app (Hono + lowdb)

**Files:**
- Create: `apps/backend/package.json`
- Create: `apps/backend/tsconfig.json`
- Create: `apps/backend/src/db.ts`
- Create: `apps/backend/src/index.ts`

- [ ] **Step 1: Create `apps/backend/package.json`**

```json
{
  "name": "backend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "@hono/node-server": "^1.13.0",
    "hono": "^4.6.0",
    "lowdb": "^7.0.1"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.2"
  }
}
```

- [ ] **Step 2: Create `apps/backend/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `apps/backend/src/db.ts`**

```ts
import { JSONFilePreset } from 'lowdb/node'

type Data = {
  items: { id: number; name: string }[]
}

const defaultData: Data = { items: [] }

export const db = await JSONFilePreset<Data>('db.json', defaultData)
```

- [ ] **Step 4: Create `apps/backend/src/index.ts`**

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { db } from './db.js'

const app = new Hono()

app.get('/', (c) => c.json({ message: 'Hello from Hono' }))

app.get('/items', async (c) => {
  await db.read()
  return c.json(db.data.items)
})

app.post('/items', async (c) => {
  const body = await c.req.json<{ name: string }>()
  const item = { id: Date.now(), name: body.name }
  db.data.items.push(item)
  await db.write()
  return c.json(item, 201)
})

serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('Backend running on http://localhost:3000')
})

export default app
```

- [ ] **Step 5: Commit**

```bash
git add apps/backend/
git commit -m "feat: add Hono + lowdb backend app"
```

---

### Task 4: Install dependencies and verify

- [ ] **Step 1: Install all workspace dependencies from repo root**

```bash
pnpm install
```

Expected: pnpm resolves all packages and creates a single `node_modules` at root plus app-level symlinks. No errors.

- [ ] **Step 2: Verify frontend dev server starts**

```bash
pnpm -F frontend dev
```

Expected output includes:
```
  VITE v6.x.x  ready in ...ms
  ➜  Local:   http://localhost:5173/
```

Stop with Ctrl+C.

- [ ] **Step 3: Verify backend dev server starts**

```bash
pnpm -F backend dev
```

Expected output:
```
Backend running on http://localhost:3000
```

In another terminal, test the API:
```bash
curl http://localhost:3000/
# {"message":"Hello from Hono"}

curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{"name":"test"}'
# {"id":...,"name":"test"}

curl http://localhost:3000/items
# [{"id":...,"name":"test"}]
```

Stop with Ctrl+C.

- [ ] **Step 4: Verify concurrent dev (`pnpm dev`) from root**

```bash
pnpm dev
```

Expected: Both frontend (port 5173) and backend (port 3000) start together.

- [ ] **Step 5: Commit lockfile**

```bash
git add pnpm-lock.yaml
git commit -m "chore: add pnpm lockfile after install"
```
