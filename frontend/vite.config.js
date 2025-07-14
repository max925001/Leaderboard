import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
 
  plugins: [react(),tailwindcss()],
   theme: {
    extend: {
      colors: {
        'black': '#000000',
        'green-900': '#1a3c34',
        'red-900': '#3b0d11',
        'green-600': '#16a34a',
        'red-600': '#dc2626',
        'gray-800': '#1f2937',
        'gray-700': '#374151',
        'gray-600': '#4b5563',
        'gray-400': '#9ca3af',
      },
    },
  },
})
