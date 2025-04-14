import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import react from '@vitejs/plugin-react'
import adonisjs from '@adonisjs/vite/client'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: true, entrypoint: 'inertia/app/ssr.tsx' } }),
    react(),
    adonisjs({ entrypoints: ['inertia/app/app.tsx'], reload: ['resources/views/**/*.edge'] }),
  ],

  resolve: {
    alias: {
      '@components': `${getDirname(import.meta.url)}/inertia/components/`,
      '@pages': `${getDirname(import.meta.url)}/inertia/pages/`,
      '@css': `${getDirname(import.meta.url)}/inertia/css/`,
      '@provider': `${getDirname(import.meta.url)}/inertia/provider/`,
    },
  },
})
