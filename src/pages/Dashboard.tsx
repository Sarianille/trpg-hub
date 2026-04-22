import { useTranslation } from 'react-i18next'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { GamesProvider } from '@/contexts/GamesContext'
import { AddGameForm } from '@/components/AddGameForm'
import { GameList } from '@/components/GameList'
import { Statistics } from '@/components/Statistics'
import { PageSkeleton } from '@/components/PageSkeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Dashboard() {
  const isChecking = useAuthGuard({ requireAuth: true, redirectTo: '/login' })

  const { t } = useTranslation()

  if (isChecking) return <PageSkeleton />

  return (
    <GamesProvider>
      <div className="py-8 px-4">
        {/* Mobile */}
        <div className="md:hidden">
          <Tabs defaultValue="yourTurn" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="add">{t('dashboard.tabs.add')}</TabsTrigger>
              <TabsTrigger value="yourTurn">{t('dashboard.tabs.yourTurn')}</TabsTrigger>
              <TabsTrigger value="others">{t('dashboard.tabs.others')}</TabsTrigger>
              <TabsTrigger value="statistics">{t('dashboard.tabs.statistics')}</TabsTrigger>
            </TabsList>
            <TabsContent value="add" className="flex justify-center mt-4">
              <AddGameForm />
            </TabsContent>
            <TabsContent value="yourTurn" className="flex justify-center mt-4">
              <GameList filter="yourTurn" />
            </TabsContent>
            <TabsContent value="others" className="flex justify-center mt-4">
              <GameList filter="others" />
            </TabsContent>
            <TabsContent value="statistics" className="flex justify-center mt-4">
              <Statistics />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Desktop */}
        <div className="hidden md:flex flex-row items-start gap-6">
          <AddGameForm />
          <GameList />
          <Statistics />
        </div>
      </div>
    </GamesProvider>
  )
}