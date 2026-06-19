import type { Page } from '@playwright/test'
import type { Game } from '../../../src/types'
import { TEST_USER } from './session'

export function makeGame(overrides: Partial<Game> = {}): Game {
  return {
    id: crypto.randomUUID(),
    user_id: TEST_USER.id,
    my_character: 'Alex',
    other_characters: ['Felix', 'Nyx'],
    is_my_turn: true,
    updated_at: new Date().toISOString(),
    tag: 'Test',
    posts_written_by_me: 3,
    note: null,
    finished_at: null,
    is_important: false,
    ...overrides,
  }
}

export async function mockGames(page: Page, initial: Game[]) {
  const games = [...initial]

  await page.route('**/rest/v1/games**', async route => {
    const method = route.request().method()
    if (method === 'GET') {
      return route.fulfill({ json: games })
    }
    if (method === 'POST') {
      const created = makeGame(route.request().postDataJSON())
      games.push(created)
      return route.fulfill({ status: 201, json: [created] })
    }
    if (method === 'PATCH' || method === 'DELETE') {
      return route.fulfill({status: 204, body: ''})
    }

    return route.fallback()
  })

  return games
}