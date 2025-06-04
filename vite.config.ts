// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/movie-app/', // ✅ Correct base for GitHub Pages repo subpath
})
