export const TAG_COLORS = {
  red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  teal: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  pink: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
} as const

export type TagColor = keyof typeof TAG_COLORS

export const TAG_SWATCH_HEX: Record<TagColor, string> = {
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  green: '#22c55e',
  teal: '#14b8a6',
  blue: '#3b82f6',
  purple: '#a855f7',
  pink: '#ec4899',
  gray: '#6b7280',
}