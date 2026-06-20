import { test } from './support/fixtures'
import { expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/user.json' })

test.describe('Navigation bar', () => {
  test('signs out and redirects to login page', async ({ page }) => {
    await page.route('**/auth/v1/logout**', route => route.fulfill({ status: 204, json: '' }))
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign Out' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('toggles dark mode', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveClass(/light/)
    await page.locator('button:has(.lucide-moon)').click()
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('switches languages', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-slot="select-trigger"]').first().click()
    await page.getByRole('option', { name: 'Čeština' }).click()
    await expect(page.getByRole('button', { name: 'Odhlásit se' })).toBeVisible()
  })
})