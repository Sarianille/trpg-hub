import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import type { ReactNode } from "react"
import type { Game } from "@/types"

type GamesContextValue = {
  games: Game[]
  setGames: React.Dispatch<React.SetStateAction<Game[]>>
  error: string | null
  isInitialized: boolean
}

const GamesContext = createContext<GamesContextValue | null>(null)

export function GamesProvider({ children }: { children: ReactNode }) {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    const fetchGames = async () => {
      try {
        setError(null)
        const { data, error } = await supabase.from('games').select('*')

        if (error) throw error
        if (!cancelled) setGames(data)
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'generic')
      } finally {
        if (!cancelled) setIsInitialized(true)
      }
    }

    const setup = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) supabase.realtime.setAuth(session.access_token)

        await fetchGames()

        subscription = supabase
          .channel('games-global')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => fetchGames())
          .subscribe()
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'generic')
      }
    }

    setup()

    return () => {
      cancelled = true
      if (subscription) supabase.removeChannel(subscription)
    }
  }, [])

  return (
    <GamesContext.Provider value={{ games, setGames, error, isInitialized }}>
      {children}
    </GamesContext.Provider>
  )
}

export function useGames({ includeFinished = false } = {}) {
  const context = useContext(GamesContext)
  if (!context) throw new Error("useGames must be used within a GamesProvider")

  const games = includeFinished ? context.games : context.games.filter(game => !game.finished_at)

  return { ...context, games }
}