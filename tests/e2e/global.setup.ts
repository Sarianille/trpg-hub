import { test as setup } from '@playwright/test'
import { fakeSession } from './support/session'

const authFile = 'tests/e2e/.auth/user.json'

setup('authenticate', async({ page, context }) => {
  // Avoid hitting Supabase
  await context.route('**/auth/v1/token/**', route => route.fulfill({json: fakeSession()}))

  await page.goto('/login')
  await page.getByLabel('Email').fill('test@example.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Login'}).click()

  // Exact localStorage format is not known, let supabase-js populate it with our fake session
  await page.waitForFunction(() => Object.keys(localStorage).some(key => key.startsWith('sb-') && key.endsWith('-auth-token')))

  await context.storageState({ path: authFile })
})