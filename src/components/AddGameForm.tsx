import { useState } from "react"
import { supabase } from "@/lib/client"
import { Button } from '@/components/ui/button'

export function AddGameForm() {
  const [myCharacter, setMyCharacter] = useState('')
  const [otherCharacters, setOtherCharacters] = useState('')

  const handleAddGame = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('games').insert({
      user_id: user?.id,
      my_character: myCharacter,
      other_characters: otherCharacters.split(',').map(c => c.trim()),
      is_my_turn: true
    })

    if (error) {
      console.error('Error adding game:', error)
    } else {
      setMyCharacter('')
      setOtherCharacters('')
    }
  }

  return (
  <div>
    <input
      type="text"
      placeholder="Your character"
      value={myCharacter}
      onChange={(e) => setMyCharacter(e.target.value)}
    />
    <input
      type="text"
      placeholder="Other characters (comma separated)"
      value={otherCharacters}
      onChange={(e) => setOtherCharacters(e.target.value)}
    />
    <Button onClick={handleAddGame}>
      Add Game
    </Button>
  </div>
  )
}