import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGames } from "@/contexts/GamesContext"
import type { Game } from "@/types"
import { Card } from "@/components/ui/card"
import { GameCard } from "@/components/GameCard"
import { TagFilter } from "@/components/TagFilter"

type GameListProps = {
  filter?: 'yourTurn' | 'others' | 'all'
}

export function GameList({ filter = 'all' }: GameListProps) {
  const { games, setGames, error, isInitialized } = useGames()
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const { t } = useTranslation()

  const tags = Array.from(new Set(games.map(g => g.tag).filter((t): t is string => !!t)))
  const filteredGames = selectedTags.length > 0 ? games.filter(g => g.tag && selectedTags.includes(g.tag)) : games

  const sortedGames = [...filteredGames].sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
  const gamesWaitingForMe = sortedGames.filter(game => game.is_my_turn)
  const gamesWaitingForOthers = sortedGames.filter(game => !game.is_my_turn)

  const handleDelete = (id: string) => setGames(prev => prev.filter(g => g.id !== id))
  const handleUpdate = (updatedGame: Game) => setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g))

  const handleSelectTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])

  const renderColumn = (title: string, games: Game[]) => (
    <div className="flex flex-col gap-2 w-full items-center">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {games.map((game) => (
        <GameCard 
          key={game.id}
          game={game}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      ))}
    </div>
  )

  return (
    <Card className="flex flex-col gap-2 w-3/4 items-center md:max-h-[calc(100vh-130px)] md:overflow-y-auto custom-scrollbar">
      <div className="w-full flex justify-end px-2">
        <TagFilter
          tags={tags}
          selectedTags={selectedTags}
          onSelectTag={handleSelectTag}
          onClear={() => setSelectedTags([])}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full items-start">
        {(filter === 'all' || filter === 'yourTurn') && renderColumn(t('gameList.yourTurn'), gamesWaitingForMe)}
        {(filter === 'all' || filter === 'others') && renderColumn(t('gameList.waitingForOthers'), gamesWaitingForOthers)}
      </div>
      {!isInitialized && <p>{t('gameList.loading')}</p>}
      {error && <p className="text-sm text-red-500">{error === 'generic' ? t('gameList.error') : error}</p>}
      {isInitialized && games.length === 0 && <p>{t('gameList.noGames')}</p>}
    </Card>
  )
}