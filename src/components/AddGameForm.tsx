import { useState } from "react"
import { supabase } from "@/lib/client"
import { useAuth } from "@/contexts/AuthContext"
import { useTranslation } from "react-i18next"
import { Info } from "lucide-react"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function AddGameForm() {
  const { user } = useAuth()
  const [myCharacter, setMyCharacter] = useState('')
  const [otherCharacters, setOtherCharacters] = useState('')
  const [tag, setTag] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const handleAddGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const parsedOthers = otherCharacters
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)

    // Ensure at least one character is entered and " , " won't bypass validation
    if (parsedOthers.length === 0) {
      setError(t('addGame.otherCharactersRequired'))
      return
    }

    if (!user) {
      setError(t('addGame.error'))
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.from('games').insert({
        user_id: user.id,
        my_character: myCharacter,
        other_characters: parsedOthers,
        is_my_turn: true,
        tag: tag || null,
      })

      if (error) throw error
      setMyCharacter('')
      setOtherCharacters('')
      setTag('')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('addGame.error'))
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
              <Label htmlFor="myCharacter">{t('addGame.myCharacter')}</Label>
              <Input
                id="myCharacter"
                type="text"
                placeholder={t('addGame.myCharacterPlaceholder')}
                required
                value={myCharacter}
                onChange={(e) => setMyCharacter(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="otherCharacters">{t('addGame.otherCharacters')}
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('addGame.otherCharactersTooltip')}</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="otherCharacters"
                type="text"
                placeholder={t('addGame.otherCharactersPlaceholder')}
                required
                value={otherCharacters}
                onChange={(e) => setOtherCharacters(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tag">{t('addGame.tag')}</Label>
              <Input
                id="tag"
                type="text"
                placeholder={t('addGame.tagPlaceholder')}
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
              {isLoading ? t('addGame.submitting') : t('addGame.submit')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}