import { useAuthGuard } from '@/hooks/useAuthGuard'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'
import { PageSkeleton } from '@/components/PageSkeleton'

export default function Dashboard() {
  const isChecking = useAuthGuard({ requireAuth: true, redirectTo: '/login' })

  if (isChecking) return <PageSkeleton />

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 py-8 px-4">
      <AddGameForm />
      <GameList />
      <Statistics />
    </div>
  )
}