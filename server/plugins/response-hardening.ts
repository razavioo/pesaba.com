import { removeResponseHeader } from 'h3'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response) => {
    if (!response.headers) return
    delete response.headers['x-powered-by']
    delete response.headers['X-Powered-By']
  })

  nitroApp.hooks.hook('beforeResponse', (event) => {
    removeResponseHeader(event, 'x-powered-by')
    removeResponseHeader(event, 'x-nitro-prerender')
    removeResponseHeader(event, 'server-timing')
  })
})
