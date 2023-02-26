import { helloq } from "$lib/qron";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
  async hello({ request }) {
    const form = await request.formData()
    const name = form.get('name')

    helloq.job.afterMinutes(1).schedule({
      name: String(name),
    })

    helloq.cron.everyMinutes(1).schedule({
      name: String(name),
    })

    if (!name) {
      return {
        success: false,
        errors: {
          name: 'name is required 🚨',
        }
      }
    }

    await helloq.job.expr('@after 1 second').schedule({
      name: String(name),
    })
    console.log('scheduled job:', name)
  }
}