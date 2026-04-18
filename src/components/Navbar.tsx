import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/client'
import type { Session } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslation } from 'react-i18next'
import i18n from '@/lib/i18n'
import { FeedbackForm } from '@/components/FeedbackForm'

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null)

  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()

  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
  <div className="flex items-center justify-between p-3">
    <div>TRPG hub</div>
    <div className="flex items-center gap-2">
      {session && <FeedbackForm />}
      <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val ?? undefined)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="cs">Čeština</SelectItem>
          <SelectItem value="sk">Slovenčina</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
      <Button size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
      {session && (
        <Button onClick={handleLogout}>
          {t('logout')}
        </Button>
      )}
    </div>
  </div>
  )
}