import { useEffect } from 'react'
import { supabase } from '@/lib/client'
import { Navbar } from '@/components/Navbar'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'

export default function Dashboard() {
  useEffect(() => {
    const checkAuth = async () => {
      const { error } = await supabase.auth.getUser()
      if (error) location.href = '/login'
    }
    checkAuth()
  }, [])

  return (
    <div>
      <div>
        <AddGameForm />
        <GameList />
      </div>
    </div>
  )
}