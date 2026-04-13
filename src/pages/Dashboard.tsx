import { useEffect } from 'react'
import { supabase } from '@/lib/client'
import { Navbar } from '@/components/Navbar'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'

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
      <Navbar />
      <div className="flex flex-col md:flex-row items-start gap-6 py-8 px-4">
        <AddGameForm />
        <GameList />
        <Statistics />
      </div>
    </div>
  )
}