import { getAllRoles, getHigherLevelAccess } from '#services/get_higher_level_access'
import { defineConfig } from '@adonisjs/inertia'
import type { InferSharedProps } from '@adonisjs/inertia/types'

const inertiaConfig = defineConfig({
  rootView: 'inertia_layout',

  sharedData: {
    user: (ctx) => ctx.inertia.always(() => ctx.auth?.user),
    isAdmin: (ctx) =>
      ctx.inertia.always(async () => {
        const highestRole = await getHigherLevelAccess()
        if (highestRole?.role === ctx.auth?.user?.role) {
          return true
        }
      }),
    roles: (ctx) =>
      ctx.inertia.always(async () => {
        const highestRole = await getHigherLevelAccess()
        if (highestRole?.role === ctx.auth?.user?.role) {
          return await getAllRoles()
        }
      }),
  },

  ssr: {
    enabled: true,
    entrypoint: 'inertia/app/ssr.tsx',
  },
})

export default inertiaConfig

declare module '@adonisjs/inertia/types' {
  export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
