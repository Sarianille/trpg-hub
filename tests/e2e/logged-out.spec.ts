import { test } from './support/fixtures'
import { expect } from '@playwright/test'

test.describe('Logged out actions', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText('Enter your email below to login to your account')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  test('stays on login page if empty credentials provided', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page).toHaveURL(/\/login$/)
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await page.route('**/auth/v1/token**', route => {
      route.fulfill({ status: 400, json: { error_description: 'Invalid login credentials' }})
    })
    await page.goto('/login')
    await page.getByLabel('Email').fill('nobody@example.com')
    await page.getByLabel('Password', { exact: true }).fill('wrongpassword')
    await page.getByRole('button', { name: 'Login' }).click()
    await expect(page.getByText('Invalid login credentials')).toBeVisible()
  })

  test('navigates between auth pages', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: 'Sign up' }).click()
    await expect(page).toHaveURL(/\/sign-up$/)
    await page.getByRole('link', { name: 'Login' }).click()
    await expect(page).toHaveURL(/\/login$/)
    await page.getByRole('link', { name: 'Forgot your password?' }).click()
    await expect(page).toHaveURL(/\/forgot-password$/)
  })

  test('sign up shows confirmation message', async ({ page }) => {
    await page.route('**/auth/v1/signup**', route => {
      route.fulfill({json: { user: {}, session: null }})
    })
    await page.goto('/sign-up')
    await page.getByLabel('Email').fill('new@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Repeat Password').fill('password123')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByText('Thank you for signing up!')).toBeVisible()
  })

  test('sign up rejects mismatched passwords', async ({ page }) => {
    await page.goto('/sign-up')
    await page.getByLabel('Email').fill('new@example.com')
    await page.getByLabel('Password', { exact: true }).fill('password123')
    await page.getByLabel('Repeat Password').fill('mismatchedpassword')
    await page.getByRole('button', { name: 'Sign up' }).click()
    await expect(page.getByText('Passwords do not match')).toBeVisible()
  })

  test('redirects to /login when accessing dashboard while logged out', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('shows 404 page for unknown routes', async ({ page }) => {
    await page.goto('/does-not-exist')
    await expect(page.getByText('Page not found')).toBeVisible()
  })
})