import type { RequestHandler } from '@sveltejs/kit'
import { createClient as _createClient, Commit, Stop, type Config, type TinyRequest, Fail, Retry, tinyq } from 'sdk'

export const createClient = (config: Config) => {
  const handlers = new Map<string, RequestHandler>()

  const client = _createClient(config)
  const createQueue = <T>(queue: string, x: (req: TinyRequest<T>) => Promise<Commit<T> | Stop<T> | Fail<T> | Retry<T>>) => {
    const q = client<T>(queue)
    const handler: RequestHandler = async ({ request }) => {
      try {
        const sig = request.headers.get('x-tinyq-sig')
        console.log('[TINYQ:SIG]', sig)

        const req = await q.parse(await request.json(), sig || '')
        const res = await x(req)

        return new Response(res.dump(), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('[TINYQ:ERROR]', queue, error)
        
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
  const sdk = tinyq(config)

  const handlerWrapper: RequestHandler = async (event) => {
    const url = new URL(event.request.url)
    let handler: RequestHandler | undefined

    for (const name of handlers.keys()) {
      if (url.pathname.endsWith(name)) {
        handler = handlers.get(name)
      }
    }

    if (!handler) {
      console.error('[TINYQ:ERROR]', 'no handler found for', url.pathname)
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