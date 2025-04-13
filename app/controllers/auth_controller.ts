import type { HttpContext } from '@adonisjs/core/http'
import { loginSchema } from '../validator/auth.schema.js'
import User from '#models/user'

export default class AuthController {
  public async login({ response, request, auth, session }: HttpContext) {
    try {
      const payload = await loginSchema.parseAsync(request.body())
      const user = await User.verifyCredentials(payload.username, payload.code)
      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash({
        errors: 'Invalid username or code',
      })
      return response.redirect().back()
    }
  }
}
