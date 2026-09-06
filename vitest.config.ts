import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/research/**/*.test.ts', 'tests/graph/**/*.test.ts', 'tests/ui/**/*.test.tsx'],
    setupFiles: ['./vitest.setup.ts'],
  },
})
