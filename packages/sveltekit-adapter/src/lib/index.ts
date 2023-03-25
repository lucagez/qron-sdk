import type { RequestHandler } from '@sveltejs/kit'
import { createClient as _createClient, Commit, Stop, type Config, type TinyRequest, Fail, Retry, qron, type Job, type Cron } from '@qron-run/sdk'
import type { z } from 'zod'

export const createClient = (config: Config = {}) => {

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

    // TODO: add support for custom paths via separate prop as it's confusing
    // publicUrl: `${publicUrl}/api/qron`,
    publicUrl,
    token,
    prod: process.env['NODE_ENV'] === 'production',
  })

  const _create = <T extends z.ZodTypeAny = z.ZodAny>(
    name: string, 
    x: (req: TinyRequest<T>) => Promise<Commit<T> | Stop<T> | Fail<T> | Retry<T>>,
    schema?: T
  ) => {
    const q = client<T>(name, schema)
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
        console.error('[QRON:ERROR]', name, error)
        
        return new Response(JSON.stringify({ status: 'FAILURE' }), {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }
    }

    // Assign handler to both cron and job
    // so they can be mounted later.
    Object.assign(q.cron, {
      handler,
      name,
    })
    Object.assign(q.job, {
      handler,
      name,
    })

    return {
      cron: q.cron,
      job: q.job,
    }
  }

  const createQueue = <T extends z.ZodTypeAny = z.ZodAny>(
    name: string, 
    x: (req: TinyRequest<z.infer<T>>) => Promise<Commit<z.infer<T>> | Stop<z.infer<T>> | Fail<z.infer<T>> | Retry<z.infer<T>>>, 
    schema?: T
  ) => {
    const { job } = _create(name, x, schema)
    return job
  }

  const createCron = <T extends z.ZodTypeAny = z.ZodAny>(
    name: string, 
    x: (req: TinyRequest<z.infer<T>>) => Promise<Commit<z.infer<T>> | Stop<z.infer<T>> | Fail<z.infer<T>> | Retry<z.infer<T>>>, 
    schema?: T
  ) => {
    const { cron } = _create(name, x, schema)
    return cron
  }

  const sdk = qron(config)
  return {
    createQueue,
    createCron,
    sdk,
  }
}

export const createHandler = (
  ...args: Array<Job<any> | Cron<any>>
): RequestHandler => {
  const handlers = new Map<string, RequestHandler>()

  for (const arg of args) {
    // @ts-ignore
    handlers.set(arg.name, arg.handler)
  }

  return async (event) => {
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
}