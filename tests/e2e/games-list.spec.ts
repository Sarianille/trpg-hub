import { test } from './support/fixtures'
import { expect } from '@playwright/test'
import { makeGame } from './support/mocks'
import { LAYOUTS, layoutHelpers } from './support/layouts'

test.use({ storageState: 'tests/e2e/.auth/user.json' })

for (const layout of LAYOUTS) {
  test.describe(`List - ${layout.name} layout`, () => {
    test.use({ viewport: layout.viewport })

    test.describe('List with games', () => {
      test.use({ seed: {
        games: [
          makeGame({ my_character: 'Adrian', is_my_turn: true, tag: 'RL' }),
          makeGame({ my_character: 'Kitty', is_my_turn: false, tag: 'DRAO'}),
        ]
      }})

      test('renders both columns and games in them', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await expect(dashboard.getByRole('heading', { name: 'Your turn' })).toBeVisible()
        await expect(dashboard.getByText('Adrian')).toBeVisible()
        await reveal('others')
        await expect(dashboard.getByRole('heading', { name: 'Waiting for others' })).toBeVisible()
        await expect(dashboard.getByText('Kitty')).toBeVisible()
      })
    })

    test.describe('Empty list', () => {
      test.use({ seed: { games: [] } })

      test('shows empty state message', async ({ page }) => {
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await expect(dashboard.getByText('No games yet. Add one!')).toBeVisible()
      })
    })

    test.describe('List error state', () => {
      test('shows error when fetching games fails', async ({ page }) => {
        await page.route('**/rest/v1/games**', route => route.fulfill({ status: 500}))
        const { dashboard, reveal } = layoutHelpers(page, layout.name)
        await page.goto('/')
        await reveal('yourTurn')
        await expect(dashboard.getByText('An error occurred').first()).toBeVisible()
      })
    })
  })
}