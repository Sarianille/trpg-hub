import { useEffect, useState } from "react"
import { supabase } from "@/lib/client"
import { useTranslation } from "react-i18next"
import type { Game } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function Statistics() {
  const [stats, setStats] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const { t } = useTranslation()
      
  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null

    const fetchStats = async () => {
      try {
        setError(null)

        const { data, error } = await supabase.from('games').select('*')

        if (error) {
          throw error
        } else {
          setStats(data)
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : t('statistics.error'))
      } finally {
        setIsInitialized(true)
      }
    }

    const setup = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) supabase.realtime.setAuth(session.access_token)
      
        await fetchStats()

        subscription = supabase
          .channel('public:stats')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => fetchStats())
          .subscribe()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : t('statistics.error'))
      }
    }
    
    setup()

    return () => { if (subscription) supabase.removeChannel(subscription) }
  }, [t])

  const activeGames = stats.filter(s => !s.finished_at)
  const tags = Array.from(new Set(stats.map(s => s.tag).filter(Boolean)))
  const tagStats = tags.map(tag => ({
    tag,
    activeGames: activeGames.filter(s => s.tag === tag).length,
    postsWrittenByMe: stats.filter(s => s.tag === tag).reduce((sum, stat) => sum + stat.posts_written_by_me, 0),
    waitingForMe: activeGames.filter(s => s.tag === tag && s.is_my_turn).length,
    waitingForOthers: activeGames.filter(s => s.tag === tag && !s.is_my_turn).length,
  }))

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
        {!isInitialized && t('statistics.loading')}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {isInitialized && (
          <>
            <p>{t('statistics.activeGames', { count: activeGames.length })}</p>
            <div className="text-sm text-muted-foreground ml-2">
              {isExpanded && tagStats.filter(s => s.activeGames > 0).map(s => (
                <p key={s.tag}>{s.tag}: { t('statistics.activeGames', { count: s.activeGames })}</p>
              ))}
            </div>
            <p>{t('statistics.postsWritten', { count: stats.reduce((sum, stat) => sum + stat.posts_written_by_me, 0) })}</p>
            <div className="text-sm text-muted-foreground ml-2">
              {isExpanded && tagStats.filter(s => s.postsWrittenByMe > 0).map(s => (
                <p key={s.tag}>{s.tag}: { t('statistics.postsWritten', { count: s.postsWrittenByMe })}</p>
              ))}
            </div>
            <p>{t('statistics.waitingForMe', { count: activeGames.filter(stat => stat.is_my_turn).length })}</p>
            <div className="text-sm text-muted-foreground ml-2">
              {isExpanded && tagStats.filter(s => s.waitingForMe > 0).map(s => (
                <p key={s.tag}>{s.tag}: { t('statistics.waitingForMe', { count: s.waitingForMe })}</p>
              ))}
            </div>
            <p>{t('statistics.waitingForOthers', { count: activeGames.filter(stat => !stat.is_my_turn).length })}</p>
            <div className="text-sm text-muted-foreground ml-2">
              {isExpanded && tagStats.filter(s => s.waitingForOthers > 0).map(s => (
                <p key={s.tag}>{s.tag}: { t('statistics.waitingForOthers', { count: s.waitingForOthers })}</p>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}