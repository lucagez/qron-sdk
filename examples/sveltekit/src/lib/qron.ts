import { createClient } from '@qron-run/sveltekit'
import { env } from '$env/dynamic/public'
import { z } from 'zod'

export const { createQueue, sdk, handler } = createClient({
  publicUrl: env.PUBLIC_URL,
})

export const helloSchema = z.object({
  name: z.string(),
})

export const helloq = createQueue('helloq', async (req) => {
  console.log('Hello', req.state.name, '👋')
  return req.commit()
}, helloSchema)