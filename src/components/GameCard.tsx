import { useState } from "react"
import { supabase } from "@/lib/client"
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

  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from('games').delete().eq('id', id)
      if (error) {
        throw error
      } else {
        onDelete(id)
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error deleting game. Please try again.')
    }
  }

  const switchTurn = async (id: string) => {
    try {
      const updates = {
        is_my_turn: !game.is_my_turn,
        ...(game.is_my_turn && { posts_written_by_me: game.posts_written_by_me + 1 })
      }
      const { error } = await supabase.from('games').update(updates).eq('id', id)
      if (error) {
        throw error
      } else {
        onUpdate({ ...game, ...updates })
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

  const saveNote = async () => {
    await supabase.from('games').update({ note: note }).eq('id', game.id)
    onUpdate({ ...game, note })
    setEditingNote(false)
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
            onBlur={() => saveNote()}
          />
        ) : (
          <p 
            className="text-sm text-muted-foreground cursor-pointer whitespace-pre-wrap mb-2"
            onClick={() => { setEditingNote(true); setNote(game.note ?? '') }}
          >
            {game.note || 'Add a note...'}
          </p>
        )}
        <p>Posts written by you: {game.posts_written_by_me}</p>
        <p>Last response: {elapsedTime(game.updated_at)}</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </CardContent>
      <CardFooter className="flex justify-around">
        <Button onClick={() => switchTurn(game.id)}>Switch turn</Button>
        <Button onClick={() => deleteGame(game.id)}>Finish game</Button>
      </CardFooter>
    </Card>
  )
}