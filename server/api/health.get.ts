import { defineEventHandler, setResponseHeader } from 'h3'

export default defineEventHandler((event) => {
  setResponseHeader(event, 'cache-control', 'no-store, max-age=0')
  return { ok: true }
})
