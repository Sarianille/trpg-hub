import { useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import type { Game } from "@/types"

export function GameList() {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null

    const fetchGames = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await supabase.from('games').select('*')

        if (error) {
          throw error
        } else {
          setGames(data)
        }
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    const setup = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) supabase.realtime.setAuth(session.access_token)
      
        await fetchGames()

        subscription = supabase
          .channel('public:games')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'games' }, () => fetchGames())
          .subscribe()
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      }
    }
    
    setup()

    return () => { if (subscription) supabase.removeChannel(subscription) }
  }, [])

  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from('games').delete().eq('id', id)
      if (error) {
        throw error
      } else {
        setGames(games.filter(game => game.id !== id))
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error deleting game. Please try again.')
    }
  }

  return (
  <div>
    {isLoading && <p>Loading games...</p>}
    {error && <p className="text-sm text-red-500">{error}</p>}
    {!isLoading && games.length === 0 && <p>No games yet. Add one above!</p>}
    {games.map((game) => (
      <div key={game.id}>
        {game.my_character} x {game.other_characters.join(', ')}
        <button onClick={() => deleteGame(game.id)}>x</button>
      </div>
    ))}
  </div>
  )
}