import { test as base } from '@playwright/test'
import { mockGames } from './mocks'
import type { Game } from '../../../src/types'

export const test = base.extend<{ seedGames: Game[] }>({
  seedGames: [[], { option: true }],
  page: async ({ page, seedGames }, use) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'))
    await mockGames(page, seedGames)
    await use(page)
  }
})