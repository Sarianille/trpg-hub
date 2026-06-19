import { defineConfig, devices } from '@playwright/test';

const SUPABASE_ENV = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
}

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['setup'] },
  ],
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    env: SUPABASE_ENV,
  },
})