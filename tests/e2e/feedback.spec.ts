import { test } from './support/fixtures'
import { expect } from '@playwright/test'

test.use({ storageState: 'tests/e2e/.auth/user.json' })

test.describe('Feedback form', () => {
  test('message is required', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByText('Your feedback message is required.')).toBeVisible()
  })

  test('closes modal after submission', async ({ page }) => {
    await page.route('**/functions/v1/send-feedback**', route => route.fulfill({ json: {} }))
    await page.goto('/')
    await page.getByRole('button', { name: 'Feedback' }).click()
    await page.getByLabel('Your feedback').fill('Great app!')
    await page.getByRole('button', { name: 'Submit' }).click()
    await expect(page.getByRole('dialog')).toBeHidden()
  })
})