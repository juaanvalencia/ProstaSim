import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      // Tests live in tests/. main.jsx only mounts the app in the browser; it has no logic to test.
      exclude: ['src/main.jsx'],
      reporter: ['text', 'html'],
    },
  },
})
