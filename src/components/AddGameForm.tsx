import { useState } from "react"
import { supabase } from "@/lib/client"
import { Info } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function AddGameForm() {
  const [myCharacter, setMyCharacter] = useState('')
  const [otherCharacters, setOtherCharacters] = useState('')
  const [tag, setTag] = useState('')
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
        is_my_turn: true,
        tag: tag || null,
      })

      if (error) {
        throw error
      } else {
        setMyCharacter('')
        setOtherCharacters('')
        setTag('')
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
              <Label htmlFor="otherCharacters">Other Characters
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Comma separate multiple characters</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="otherCharacters"
                type="text"
                placeholder="Other characters"
                required
                value={otherCharacters}
                onChange={(e) => setOtherCharacters(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">Tag</Label>
              <Input
                id="tag"
                type="text"
                placeholder="Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                list="tag-suggestions"
              />
              <datalist id="tag-suggestions">
                <option value="Mois Gris" />
                <option value="DRAO" />
                <option value="Helvanir" />
                <option value="Gallirea" />
                <option value="Brloh" />
                <option value="Pelíšek" />
              </datalist>
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