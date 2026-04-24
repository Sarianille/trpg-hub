import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import { useAuth } from "@/contexts/AuthContext"
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

  const { user } = useAuth()
  const userId = user?.id

  useEffect(() => {
    if (!userId) {
      setGames([])
      setIsInitialized(false)
      return
    }

    let subscription: ReturnType<typeof supabase.channel> | null = null
    let cancelled = false

    const fetchGames = async () => {
      try {
        setError(null)
        const { data, error } = await supabase.from('games').select('*')

        if (error) throw error
        if (!cancelled) setGames(data)
      } catch (error: unknown) {
        // To avoid a dependency on t, we use a generic error key and handle the translation in the render
        if (!cancelled) setError(error instanceof Error ? error.message : 'generic')
      } finally {
        if (!cancelled) setIsInitialized(true)
      }
    }

    const setup = async () => {
      try {
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
  }, [userId])

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