import { useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import type { Game } from "@/types"

export function GameList() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      const { data, error } = await supabase.from('games').select('*')

      if (error) {
        console.error('Error fetching games:', error)
      } else {
        setGames(data)
      }
    }

    fetchGames()
  }, [])

  const deleteGame = async (id: string) => {
    const { error } = await supabase.from('games').delete().eq('id', id)
    if (error) {
      console.error('Error deleting game:', error)
    } else {
      setGames(games.filter(game => game.id !== id))
    }
  }

  return (
  <div>
    {games.map((game) => (
      <div key={game.id}>
        {game.my_character} x {game.other_characters.join(', ')}
        <button onClick={() => deleteGame(game.id)}>x</button>
      </div>
    ))}
  </div>
  )
}