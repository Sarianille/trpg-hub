import { useState } from "react"
import { supabase } from "@/lib/client"
import { useTranslation } from "react-i18next"
import type { Game } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

type GameCardProps = {
  game: Game
  onDelete: (id: string) => void
  onUpdate: (updatedGame: Game) => void
}

export function GameCard({game, onDelete, onUpdate}: GameCardProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { t, i18n } = useTranslation()

  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from('games').update({ finished_at: new Date().toISOString() }).eq('id', id)

      if (error) throw error
      onDelete(id)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('gameCard.deleteError'))
    }
  }

  const switchTurn = async (id: string) => {
    try {
      const updates = {
        is_my_turn: !game.is_my_turn,
        ...(game.is_my_turn && { posts_written_by_me: game.posts_written_by_me + 1 })
      }

      const { error } = await supabase.from('games').update(updates).eq('id', id)

      if (error) throw error
      onUpdate({ ...game, ...updates })
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('gameCard.switchTurnError'))
    }
  }

  const saveNote = async () => {
    if (note === (game.note ?? '')) {
      setEditingNote(false)
      return
    }

    try {
      const { error } = await supabase.from('games').update({ note }).eq('id', game.id)

      if (error) throw error
      onUpdate({ ...game, note })
      setEditingNote(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('gameCard.saveNoteError'))
    }
  }

  const elapsedTime = (updatedAt: string) => {
    const elapsed = Math.max(0, Date.now() - new Date(updatedAt).getTime())
    const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' })
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24))
    return rtf.format(-days, 'day')
  }
  
  return (
    <Card className="w-5/6 gap-2">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          <span>{game.my_character}</span>
          <span>x</span>
          <span>{game.other_characters.join(', ')}</span>
        </CardTitle>
        {game.tag && <Badge variant="outline">{game.tag}</Badge>}
      </CardHeader>
      <CardContent>
        {editingNote ? (
          <Textarea 
            className="mb-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={saveNote}
          />
        ) : (
          <p 
            className="text-sm text-muted-foreground cursor-pointer whitespace-pre-wrap mb-2"
            onClick={() => { setEditingNote(true); setNote(game.note ?? '') }}
          >
            {game.note || t('gameCard.addNote')}
          </p>
        )}
        <p>{t('gameCard.postsWritten', { count: game.posts_written_by_me })}</p>
        <p>{t('gameCard.lastResponse', { timeAgo: elapsedTime(game.updated_at) })}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-around">
        <Button onClick={() => switchTurn(game.id)}>{t('gameCard.switchTurn')}</Button>
        <Button onClick={() => deleteGame(game.id)}>{t('gameCard.finishGame')}</Button>
      </CardFooter>
    </Card>
  )
}