import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('canvas-confetti')) {
              return 'confetti';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 5173,
    open: false,
  },
})
