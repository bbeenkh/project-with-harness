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
