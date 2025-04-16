import app from '@adonisjs/core/services/app'
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http'
import type { StatusPageRange } from '@adonisjs/core/types/http'
import { errors } from '@adonisjs/core'

export default class HttpExceptionHandler extends ExceptionHandler {
  protected renderStatusPages = app.inProduction

  /**
   * Status pages is a collection of error code range and a callback
   * to return the HTML contents to send as a response.
   */
  protected statusPage: Record<StatusPageRange, (ctx: HttpContext) => Promise<any>> = {
    '404': ({ inertia }) => inertia.render('errors/not_found'),
    '500': ({ inertia }) => inertia.render('errors/server_error'),
  }

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  async handle(error: any, ctx: HttpContext) {
    if (error instanceof errors.E_ROUTE_NOT_FOUND) {
      return ctx.response.status(error.status).send(await this.statusPage[error.status](ctx))
    } else {
      const page = await this.statusPage[500](ctx)

      return ctx.response.status(500).send(page)
    }
  }

  /**
   * The method is used to report error to the logging service or
   * the a third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  async report(error: unknown, ctx: HttpContext) {
    return super.report(error, ctx)
  }
}
