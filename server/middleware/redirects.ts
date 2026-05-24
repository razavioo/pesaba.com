import { defineEventHandler, sendRedirect } from 'h3'
import { REDIRECTS } from '../redirects-map'

export default defineEventHandler((event) => {
  const raw = event.path?.split('?')[0] || '/'
  // Try both the raw (percent-encoded) and decoded forms
  const target = REDIRECTS[raw] || REDIRECTS[decodeURIComponent(raw)]
  if (target) {
    return sendRedirect(event, target, 301)
  }
})
