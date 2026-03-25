import { useState } from "react"
import { supabase } from "@/lib/client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "./ui/label"
import { Card, CardContent } from "./ui/card"

export function AddGameForm() {
  const [myCharacter, setMyCharacter] = useState('')
  const [otherCharacters, setOtherCharacters] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { error } = await supabase.from('games').insert({
        user_id: user?.id,
        my_character: myCharacter,
        other_characters: otherCharacters.split(',').map(c => c.trim()),
        is_my_turn: true
      })

      if (error) {
        throw error
      } else {
        setMyCharacter('')
        setOtherCharacters('')
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Error adding game. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-5/6 md:w-100">
      <CardContent>
        <form onSubmit={handleAddGame}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="myCharacter">Your Character</Label>
              <Input
                id="myCharacter"
                type="text"
                placeholder="Your character"
                required
                value={myCharacter}
                onChange={(e) => setMyCharacter(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otherCharacters">Other Characters</Label>
              <Input
                id="otherCharacters"
                type="text"
                placeholder="Other characters (comma separated)"
                required
                value={otherCharacters}
                onChange={(e) => setOtherCharacters(e.target.value)}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Game'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}