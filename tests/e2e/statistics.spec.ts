import { test } from './support/fixtures'
import { expect } from '@playwright/test'
import { makeGame } from './support/mocks'
import { LAYOUTS, layoutHelpers } from './support/layouts'

test.use({ storageState: 'tests/e2e/.auth/user.json' })

for (const layout of LAYOUTS) {
  test.describe(`Statistics - ${layout.name} layout`, () => {
    test.use({ viewport: layout.viewport, seed: {
      games: [
        makeGame({ is_my_turn: true, finished_at: null, posts_written_by_me: 2, tag: 'Helvanir'}),
        makeGame({ is_my_turn: false, finished_at: null, posts_written_by_me: 1, tag: 'DRAO'}),
        makeGame({ finished_at: new Date().toISOString(), posts_written_by_me: 5, tag: 'Helvanir' }),
      ]
    } })

    test('shows aggregated statistics', async ({ page }) => {
      const { dashboard, reveal } = layoutHelpers(page, layout.name)
      await page.goto('/')
      await reveal('statistics')
      await expect(dashboard.getByText('Monthly Statistics')).toBeVisible()
      await expect(dashboard.getByText('2 active games')).toBeVisible()
      await expect(dashboard.getByText('1 finished game')).toBeVisible()
      await expect(dashboard.getByText('8 posts written')).toBeVisible()
      await expect(dashboard.getByText('1 game waiting for me')).toBeVisible()
    })

    test('shows statistics filtered by tag', async ({ page }) => {
      const { dashboard, reveal } = layoutHelpers(page, layout.name)
      await page.goto('/')
      await reveal('statistics')
      await dashboard.getByRole('button', { name: 'Show details' }).click()
      await expect(dashboard.getByText('Helvanir: 1 active game')).toBeVisible()
      await expect(dashboard.getByText('DRAO: 1 active game')).toBeVisible()
      await expect(dashboard.getByText('Helvanir: 1 finished game')).toBeVisible()
      await expect(dashboard.getByText('Helvanir: 7 posts written')).toBeVisible()
      await expect(dashboard.getByText('DRAO: 1 post written')).toBeVisible()
      await expect(dashboard.getByText('Helvanir: 1 game waiting for me')).toBeVisible()
    })
  })
}