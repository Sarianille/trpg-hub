import { test } from './support/fixtures'
import { expect } from '@playwright/test'
import { makeGame } from './support/mocks'
import { LAYOUTS, layoutHelpers } from './support/layouts'

test.use({ storageState: 'tests/e2e/.auth/user.json' })

for (const layout of LAYOUTS) {
  test.describe(`Games - ${layout.name} layout`, () => {
    test.use({ viewport: layout.viewport })

    test.describe('Game card actions', () => {
      test.use({ seed: {
        games: [
          makeGame({ my_character: 'Adrian', is_my_turn: true, posts_written_by_me: 2 })
        ]
      }})

      test('switching increments post count only from my turn', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await dashboard.getByRole('button', { name: 'Switch turn' }).click()
        await reveal('others')
        await expect(dashboard.getByText('Posts written by you: 3')).toBeVisible()
        await dashboard.getByRole('button', { name: 'Switch turn' }).click()
        await reveal('yourTurn')
        await expect(dashboard.getByText('Posts written by you: 3')).toBeVisible()
      })

      test('edited note is saved onBlur', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await dashboard.getByText('Add a note...').click()
        await dashboard.locator('textarea').fill('Example note')
        await dashboard.locator('textarea').blur()
        await expect(dashboard.getByText('Example note')).toBeVisible()
      })

      test('finishing a game removes it from the list', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await expect(dashboard.getByText('Adrian')).toBeVisible()
        await dashboard.getByRole('button', { name: 'Finish game' }).click()
        await expect(dashboard.getByText('Adrian')).not.toBeVisible()
      })
    })

    test.describe('Add game form', () => {
      test.use({ seed: { games: [] } })

      test('form resets after submission', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('add')
        await dashboard.getByLabel('Your character').fill('Alex')
        await dashboard.getByLabel('Other characters').fill('Felix, Nyx')
        await dashboard.getByRole('button', { name: 'Add Game' }).click()
        await expect(dashboard.getByLabel('Your character')).toHaveValue('')
        await expect(dashboard.getByLabel('Other characters')).toHaveValue('')
      })

      test('new game appears in list after submission', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('add')
        await dashboard.getByLabel('Your character').fill('Alex')
        await dashboard.getByLabel('Other characters').fill('Felix, Nyx')
        await dashboard.getByRole('button', { name: 'Add Game' }).click()
        // Realtime is not mocked, reload refetches from the mock backend
        await page.reload()
        await reveal('yourTurn')
        await expect(dashboard.getByText('Alex')).toBeVisible()
      })

      test('requires other characters edge case', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('add')
        await dashboard.getByLabel('Your character').fill('Alex')
        await dashboard.getByLabel('Other characters').fill(' , ')
        await dashboard.getByRole('button', { name: 'Add Game' }).click()
        await expect(dashboard.getByText('At least one character is required')).toBeVisible()
      })
    })
  })
}