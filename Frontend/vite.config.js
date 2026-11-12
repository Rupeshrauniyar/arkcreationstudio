import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three', '@react-three/fiber', '@react-three/drei'],
          video: ['video.js'],
          motion: ['gsap', 'framer-motion', 'lenis'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
