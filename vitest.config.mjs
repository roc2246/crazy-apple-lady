import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Simulate browser environment
    globals: true,        // Enable global APIs like `describe`, `it`, `expect`
  },
});