import type { RequestHandler } from '@sveltejs/kit'
import { createClient as _createClient, Commit, Pause, type Config, type TinyRequest, Fail, Retry, qron, type Job, type Cron } from '@qron-run/sdk'

export const createClient = (config: Config = {}) => {
  const env = import.meta.env || {
    DEV: true,
    PROD: false,
  } 
  let url = config.url || env['QRON_URL']
  if (!url && env.DEV) {
    url = 'http://localhost:9876/api/graphql'
  }
  if (!url && env.PROD) {
    url = 'https://qron.run/api/graphql'
  }
  
  // TODO: Investigate where it is better to fail in case there's no public url set
  let publicUrl = config.publicUrl || env['PUBLIC_URL']

  // TODO: Investigate where it is better to fail in case there's no token
  let token = config.token || env['QRON_TOKEN']
  const client = _createClient({
    ...config,
    url,

    // TODO: add support for custom paths via separate prop as it's confusing
    // publicUrl: `${publicUrl}/api/qron`,
    publicUrl,
    token,
    prod: env.PROD,
  })

  const _create = <T extends z.ZodTypeAny = z.ZodAny>(
    name: string, 
    x: (req: TinyRequest<T>) => Promise<Commit<T> | Pause<T> | Fail<T> | Retry<T>>,
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
    x: (req: TinyRequest<z.infer<T>>) => Promise<Commit<z.infer<T>> | Pause<z.infer<T>> | Fail<z.infer<T>> | Retry<z.infer<T>>>, 
    schema?: T
  ) => {
    const { job } = _create(name, x, schema)
    return job
  }

  const createCron = <T extends z.ZodTypeAny = z.ZodAny>(
    name: string, 
    x: (req: TinyRequest<z.infer<T>>) => Promise<Commit<z.infer<T>> | Pause<z.infer<T>> | Fail<z.infer<T>> | Retry<z.infer<T>>>, 
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

import { z } from 'zod'

const { createQueue } = createClient()

const counterq = createQueue('counter', async ({ state, commit, retry, fail }) => {
  console.log('Receiving request:', state)

  if (state.count < 10) {
    return retry({ count: state.count + 1 }).asap()
  }

  console.log('SUCCESS!')
  return commit({ count: state.count + 1 })
}, z.object({
  count: z.number()
}))