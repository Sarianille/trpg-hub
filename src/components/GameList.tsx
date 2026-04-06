import { useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import type { Game } from "@/types"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function GameList() {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | null = null

    const fetchGames = async () => {
      try {
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
        setIsInitialized(true)
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

  const switchTurn = async (id: string) => {
    try {
      const game = games.find(g => g.id === id)
      if (!game) throw new Error('Game not found')
      const { error } = await supabase.from('games').update({ is_my_turn: !game.is_my_turn }).eq('id', id)
      if (error) {
        throw error
      } else {
        setGames(games.map(g => g.id === id ? { ...g, is_my_turn: !g.is_my_turn } : g))
      } 
    } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Error switching turn. Please try again.')
    }
  }

  const elapsedTime = (updatedAt: string) => {
    const elapsed = Math.max(0, Date.now() - new Date(updatedAt).getTime())
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    return rtf.format(-days, 'day')
  }

  const gamesWaitingForMe = games.filter(game => game.is_my_turn)
  const gamesWaitingForOthers = games.filter(game => !game.is_my_turn)

  return (
  <div className="flex flex-col gap-2 w-full items-center">
    {!isInitialized && <p>Loading games...</p>}
    {error && <p className="text-sm text-red-500">{error}</p>}
    {isInitialized && games.length === 0 && <p>No games yet. Add one above!</p>}
    <div className="flex flex-col md:flex-row gap-4 w-full items-start">
      <div className="flex flex-col gap-2 w-full items-center">
        <h2 className="text-lg font-semibold mb-2">Your turn</h2>
        {gamesWaitingForMe.map((game) => (
          <Card className="w-5/6 md:w-100" key={game.id}>
            <CardHeader>
              <CardTitle>
                {game.my_character} x {game.other_characters.join(', ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Last response: {elapsedTime(game.updated_at)}</p>
              <Button onClick={() => switchTurn(game.id)}>Switch turn</Button>
              <Button onClick={() => deleteGame(game.id)}>Finish game</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full items-center">
        <h2 className="text-lg font-semibold mb-2">Waiting for others</h2>
        {gamesWaitingForOthers.map((game) => (
          <Card className="w-5/6 md:w-100" key={game.id}>
            <CardHeader>
              <CardTitle>
                {game.my_character} x {game.other_characters.join(', ')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Last response: {elapsedTime(game.updated_at)}</p>
              <Button onClick={() => switchTurn(game.id)}>Switch turn</Button>
              <Button onClick={() => deleteGame(game.id)}>Finish game</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </div>
  )
}