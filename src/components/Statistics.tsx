import { useEffect, useState } from "react"
import { supabase } from "@/lib/client"
import type { Game } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function Statistics() {
  const [stats, setStats] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
      
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
        setError(error instanceof Error ? error.message : 'An error occurred')
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
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }
    
    setup()

    return () => { if (subscription) supabase.removeChannel(subscription) }
  }, [])

  const tags = Array.from(new Set(stats.map(s => s.tag).filter(Boolean)))
  const tagStats = tags.map(tag => ({
    tag,
    activeGames: stats.filter(s => s.tag === tag).length,
    postsWrittenByMe: stats.filter(s => s.tag === tag).reduce((sum, stat) => sum + stat.posts_written_by_me, 0),
    waitingForMe: stats.filter(s => s.tag === tag && s.is_my_turn).length,
    waitingForOthers: stats.filter(s => s.tag === tag && !s.is_my_turn).length,
  }))

  return (
    <Card className="w-5/6 md:w-100">
      <CardHeader>
        <CardTitle>
          Monthly Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isInitialized && 'Loading statistics...'}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {isInitialized && (
          <>
            <p>{stats.length} active game(s)</p>
            <div className="text-sm text-muted-foreground ml-2">
              {tagStats.filter(t => t.activeGames > 0).map(t => (
                <p key={t.tag}>{t.tag}: {t.activeGames} active game(s)</p>
              ))}
            </div>
            <p>{stats.reduce((sum, stat) => sum + stat.posts_written_by_me, 0)} post(s) written</p>
            <div className="text-sm text-muted-foreground ml-2">
              {tagStats.filter(t => t.postsWrittenByMe > 0).map(t => (
                <p key={t.tag}>{t.tag}: {t.postsWrittenByMe} post(s) written</p>
              ))}
            </div>
            <p>{stats.filter(stat => stat.is_my_turn).length} game(s) waiting for me</p>
            <div className="text-sm text-muted-foreground ml-2">
              {tagStats.filter(t => t.waitingForMe > 0).map(t => (
                <p key={t.tag}>{t.tag}: {t.waitingForMe} game(s) waiting for me</p>
              ))}
            </div>
            <p>{stats.filter(stat => !stat.is_my_turn).length} game(s) waiting for others</p>
            <div className="text-sm text-muted-foreground ml-2">
              {tagStats.filter(t => t.waitingForOthers > 0).map(t => (
                <p key={t.tag}>{t.tag}: {t.waitingForOthers} game(s) waiting for others</p>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}