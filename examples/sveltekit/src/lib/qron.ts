import { createClient } from '@qron-run/sveltekit'
import { env } from '$env/dynamic/public'

export const { createQueue, sdk, handler } = createClient({
  publicUrl: env.PUBLIC_URL,
})

export const helloq = createQueue<{ name: string }>('helloq', async (req) => {
  console.log('Hello', req.state?.name, '👋')
  return req.commit()
})