import type { Page, Locator } from '@playwright/test'

export const LAYOUTS = [
  { name: 'desktop' as const, viewport: { width: 1280, height: 720 } },
  { name: 'mobile' as const, viewport: { width: 390, height: 844 } },
]

const TAB = { add: 'Add Game', yourTurn: 'Your Turn', others: 'Waiting', statistics: 'Stats' }

export function layoutHelpers(page: Page, layout: 'desktop' | 'mobile') {
  const dashboard: Locator = page.getByTestId(`layout-${layout}`)
  const reveal = async (section: keyof typeof TAB) => {
    if (layout === 'mobile') {
      await dashboard.getByRole('tab', { name: TAB[section] }).click()
    }
  }
  return { dashboard, reveal }
}