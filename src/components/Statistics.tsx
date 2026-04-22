import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGames } from "@/contexts/GamesContext"
import type { Game } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Statistics() {
  const { games, error, isInitialized } = useGames({ includeFinished: true })
  const [isExpanded, setIsExpanded] = useState(false)

  const { t } = useTranslation()

  const activeGames = games.filter(g => !g.finished_at)
  const finishedGames = games.filter(g => g.finished_at)
  const tags = Array.from(new Set(games.map(g => g.tag).filter((t): t is string => !!t)))

  const perTagCount = (predicate: (game: Game) => boolean) =>
    tags
      .map(tag => ({ tag, count: games.filter(g => g.tag === tag && predicate(g)).length }))
      .filter(row => row.count > 0)

  const perTagSum = (selector: (game: Game) => number) =>
    tags
      .map(tag => ({ tag, count: games.filter(g => g.tag === tag).reduce((sum, g) => sum + selector(g), 0) }))
      .filter(row => row.count > 0)

  const stats = [
    {
      labelKey: 'statistics.activeGames',
      total: activeGames.length,
      breakdown: perTagCount(g => !g.finished_at),
    },
    {
      labelKey: 'statistics.finishedGames',
      total: finishedGames.length,
      breakdown: perTagCount(g => !!g.finished_at),
    },
    {
      labelKey: 'statistics.postsWritten',
      total: games.reduce((sum, g) => sum + g.posts_written_by_me, 0),
      breakdown: perTagSum(g => g.posts_written_by_me),
    },
    {
      labelKey: 'statistics.waitingForMe',
      total: activeGames.filter(g => g.is_my_turn).length,
      breakdown: perTagCount(g => !g.finished_at && g.is_my_turn),
    },
    {
      labelKey: 'statistics.waitingForOthers',
      total: activeGames.filter(g => !g.is_my_turn).length,
      breakdown: perTagCount(g => !g.finished_at && !g.is_my_turn),
    }
  ]

  return (
    <Card className="w-5/6 md:w-100">
      <CardHeader>
        <CardTitle>
          {t('statistics.title')}
        </CardTitle>
        <Button variant="link" size="sm" className="w-fit p-0 h-auto text-muted-foreground" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('statistics.hideDetails') : t('statistics.showDetails')}
        </Button>
      </CardHeader>
      <CardContent>
        {!isInitialized && <p>{t('statistics.loading')}</p>}
        {error && <p className="text-sm text-red-500">{error === 'generic' ? t('statistics.error') : error}</p>}
        {isInitialized && stats.map(({ labelKey, total, breakdown }) => (
          <div key={labelKey}>
            <p>{t(labelKey, { count: total })}</p>
            {isExpanded && breakdown.length > 0 && (
              <div className="text-sm text-muted-foreground ml-2">
                {breakdown.map(({ tag, count }) => (
                  <p key={tag}>{tag}: {t(labelKey, { count })}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}