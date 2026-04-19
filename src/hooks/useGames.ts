import { useState, useEffect } from 'react'
import { supabase } from '@/lib/client'
import type { Game } from '@/types'

type UseGamesOptions = {
  channelName: string
  includeFinished?: boolean
}

export function useGames({ channelName, includeFinished = false }: UseGamesOptions) {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null

    const fetchGames = async () => {
      try {
        setError(null)

        const { data, error } = await supabase.from('games').select('*')

        if (error) throw error
        setGames(includeFinished ? data : data.filter(game => !game.finished_at))
      } catch (error: unknown) {
        // To avoid a dependency on t, we use a generic error key and handle the translation in the render
        setError(error instanceof Error ? error.message : 'generic')
      } finally {
        setIsInitialized(true)
      }
    }

    const setup = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) supabase.realtime.setAuth(session.access_token)

        await fetchGames()

        subscription = supabase
          .channel(channelName)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => fetchGames())
          .subscribe()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'generic')
      }
    }

    setup()

    return () => { if (subscription) supabase.removeChannel(subscription) }
  }, [channelName, includeFinished])

  return { games, setGames, error, isInitialized }
}