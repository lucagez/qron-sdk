import type { RequestHandler } from '@sveltejs/kit'
import { createClient as _createClient, Commit, Stop, type Config, type TinyRequest, Fail, Retry, qron } from '@qron-run/sdk'

export const createClient = (config: Config = {}) => {
  const handlers = new Map<string, RequestHandler>()

  let url = config.url || process.env['QRON_URL']
  if (!url && process.env['NODE_ENV'] !== 'production') {
    url = 'http://localhost:9876/api/graphql'
  }
  if (!url && process.env['NODE_ENV'] === 'production') {
    url = 'https://qron.run/api/graphql'
  }
  
  let publicUrl = config.publicUrl || process.env['PUBLIC_URL']
  if (!publicUrl) {
    throw new Error('missing public url. please set `PUBLIC_URL` env variable or set `publicUrl` in config')
  }

  let token = config.token || process.env['QRON_TOKEN']
  if (!token && process.env['NODE_ENV'] === 'production') {
    throw new Error('missing authentication token. please set it via `QRON_TOKEN` env variable or set `token` in config')
  }

  const client = _createClient({
    ...config,
    url,
    publicUrl: `${publicUrl}/api/qron`,
    token,
    prod: process.env['NODE_ENV'] === 'production',
  })
  const createQueue = <T>(queue: string, x: (req: TinyRequest<T>) => Promise<Commit<T> | Stop<T> | Fail<T> | Retry<T>>) => {
    const q = client<T>(queue)
    const handler: RequestHandler = async ({ request }) => {
      try {
        const sig = request.headers.get('x-qron-sig')
        // console.log('[QRON:SIG]', sig)

        const body = await request.json()
        const req = await q.parse(body, sig || '')
        const res = await x(req)

        return new Response(res.dump(), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('[QRON:ERROR]', queue, error)
        
        return new Response(JSON.stringify({ status: 'FAILURE' }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }

    }

    handlers.set(queue, handler)

    return q 
  }
  const sdk = qron(config)

  const handlerWrapper: RequestHandler = async (event) => {
    const url = new URL(event.request.url)
    let handler: RequestHandler | undefined

    for (const name of handlers.keys()) {
      if (url.pathname.endsWith(name)) {
        handler = handlers.get(name)
      }
    }

    if (!handler) {
      console.error('[QRON:ERROR]', 'no handler found for', url.pathname)
      return new Response('Not Found', {
        status: 404
      })
    }

    return handler(event)
  }


  return {
    createQueue,
    sdk,
    handler: handlerWrapper,
  }
}