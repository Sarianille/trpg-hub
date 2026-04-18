import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/client'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

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

  if (isChecking) {
    return (
      <div className="flex flex-col gap-6 min-h-[calc(100vh-130px)] items-center justify-center">
        <Card className="w-5/6 md:w-100">
          <CardHeader>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 py-8 px-4">
      <AddGameForm />
      <GameList />
      <Statistics />
    </div>
  )
}