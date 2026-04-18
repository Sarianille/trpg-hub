import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/client'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'

export default function Dashboard() {
  const [isChecking, setIsChecking] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { error } = await supabase.auth.getUser()
      if (error) navigate('/login')
      else setIsChecking(false)
    }
    checkAuth()
  }, [navigate])

  if (isChecking) return null

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 py-8 px-4">
      <AddGameForm />
      <GameList />
      <Statistics />
    </div>
  )
}