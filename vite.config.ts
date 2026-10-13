/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { staticPages } from './scripts/static-pages.ts'

// GitHub Pages sirve el sitio en /Moss-Nexus/ (el nombre del repositorio). En desarrollo se usa la raíz.
// `vite preview` también cuenta como "serve": sin isPreview, buscaría los assets fuera de /Moss-Nexus/.
export default defineConfig(({ command, isPreview }) => ({
  plugins: [react(), tailwindcss(), staticPages()],
  base: command === 'build' || isPreview ? '/Moss-Nexus/' : '/',
  test: { environment: 'node' },
}))
