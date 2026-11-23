import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const file = join(dirname(fileURLToPath(import.meta.url)), 'db.json')

export function load() {
  if (!existsSync(file)) {
    throw new Error('server/db.json belum ada. Jalankan "npm run seed" terlebih dahulu.')
  }
  return JSON.parse(readFileSync(file, 'utf8'))
}

export function save(db) {
  writeFileSync(file, JSON.stringify(db, null, 2))
}

export const nextId = (list) => list.reduce((max, x) => Math.max(max, x.id), 0) + 1
