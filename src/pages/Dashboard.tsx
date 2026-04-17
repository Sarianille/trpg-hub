import { useEffect, useState } from 'react'
import { supabase } from '@/lib/client'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'

export default function Dashboard() {
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { error } = await supabase.auth.getUser()
      if (error) location.href = '/login'
      else setIsChecking(false)
    }
    checkAuth()
  }, [])

  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 py-8 px-4">
      <AddGameForm />
      <GameList />
      <Statistics />
    </div>
  )
}