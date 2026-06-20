import { test as base } from '@playwright/test'
import { mockGames } from './mocks'
import type { Game } from '../../../src/types'

export const test = base.extend<{ seed: { games: Game[] } }>({
  seed: [ { games: [] }, { option: true }],
  page: async ({ page, seed }, use) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
    await mockGames(page, seed.games)
    await use(page)
  }
})