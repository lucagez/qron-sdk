import { helloq } from "$lib/qron";
import type { Actions, PageServerLoad } from "./$types";

export const actions: Actions = {
  async hello({ request }) {
    const form = await request.formData()
    const name = form.get('name')

    if (!name) {
      return {
        success: false,
        errors: {
          name: 'name is required 🚨',
        }
      }
    }

    await helloq.expr('@after 1 second').schedule({
      name: String(name),
    })
    console.log('scheduled job:', name)
  }
}