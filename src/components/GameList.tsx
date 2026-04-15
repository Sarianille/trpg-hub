import { useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import { useTranslation } from "react-i18next"
import type { Game } from "@/types"
import { Card } from "@/components/ui/card"
import { GameCard } from "@/components/GameCard"

export function GameList() {
  const [games, setGames] = useState<Game[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const { t } = useTranslation()

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
        setError(error instanceof Error ? error.message : t('gameList.error'))
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
        setError(error instanceof Error ? error.message : t('gameList.error'))
      }
    }
    
    setup()

    return () => { if (subscription) supabase.removeChannel(subscription) }
  }, [t])

  const sortedGames = [...games].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
  const gamesWaitingForMe = sortedGames.filter(game => game.is_my_turn)
  const gamesWaitingForOthers = sortedGames.filter(game => !game.is_my_turn)

  return (
  <Card className="flex flex-col gap-2 w-3/4 items-center md:max-h-[calc(100vh-130px)] md:overflow-y-auto custom-scrollbar">
    <div className="flex flex-col md:flex-row gap-2 w-full items-start">
      <div className="flex flex-col gap-2 w-full items-center">
        <h2 className="text-lg font-semibold mb-2">{t('gameList.yourTurn')}</h2>
        {gamesWaitingForMe.map((game) => (
          <GameCard 
            key={game.id}
            game={game}
            onDelete={(id: string) => setGames(games.filter(g => g.id !== id))}
            onUpdate={(updatedGame: Game) => setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g))}
          />
        ))}
      </div>
      <div className="flex flex-col gap-2 w-full items-center">
        <h2 className="text-lg font-semibold mb-2">{t('gameList.waitingForOthers')}</h2>
        {gamesWaitingForOthers.map((game) => (
          <GameCard 
            key={game.id}
            game={game}
            onDelete={(id: string) => setGames(games.filter(g => g.id !== id))}
            onUpdate={(updatedGame: Game) => setGames(games.map(g => g.id === updatedGame.id ? updatedGame : g))}
          />
        ))}
      </div>
    </div>
    {!isInitialized && <p>{t('gameList.loading')}</p>}
    {error && <p className="text-sm text-red-500">{error}</p>}
    {isInitialized && games.length === 0 && <p>{t('gameList.noGames')}</p>}
  </Card>
  )
}