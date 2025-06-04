// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🛠 Use empty string for Vercel deployment
export default defineConfig({
  plugins: [react()],
  base: '', // <- this is the fix
})
