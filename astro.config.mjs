import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://motion-components-docs.vercel.app',
  outDir: 'dist',
  integrations: [sitemap()],
})
