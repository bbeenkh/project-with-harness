import { JSONFilePreset } from 'lowdb/node'

type Data = {
  items: { id: number; name: string }[]
}

const defaultData: Data = { items: [] }

export const db = await JSONFilePreset<Data>('db.json', defaultData)
