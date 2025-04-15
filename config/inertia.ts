import { getAllRoles, getHigherLevelAccess } from '#services/get_higher_level_access'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  /**
   * Path to the Edge view that will be used as the root view for Inertia responses
   */
  rootView: 'inertia_layout',

  /**
   * Data that should be shared with all rendered pages
   */
  sharedData: {
    user: (ctx) => ctx.inertia.always(() => ctx.auth.user),
    roles: (ctx) =>
      ctx.inertia.always(async () => {
        const highestRole = await getHigherLevelAccess()
        if (highestRole?.role === ctx.auth.user?.role) {
          return await getAllRoles()
        }
      }),
  },

  /**
   * Options for the server-side rendering
   */
  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
