import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/client'
import type { Session } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useTranslation } from 'react-i18next'
import { FeedbackForm } from '@/components/FeedbackForm'

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null)

  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const navigate = useNavigate()

  useEffect(() => {
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
      <div>TRPG Hub</div>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-2">
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

      {/* Mobile */}
      <div className="flex md:hidden">
        <Sheet>
          <SheetTrigger render={<Button size="icon" variant="ghost"><Menu /></Button>} />
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>TRPG Hub</SheetTitle>
            </SheetHeader>

            <div className="flex flex-col gap-4 mt-6 px-4">
              {session && (
                <div className="*:w-full [&_button]:w-full [&_button]:justify-center">
                  <FeedbackForm />
                </div>
              )}

              <Select value={i18n.language} onValueChange={(val) => i18n.changeLanguage(val ?? undefined)}>
                <SelectTrigger className="w-full pl-7">
                  <SelectValue className="text-center! justify-center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Čeština</SelectItem>
                  <SelectItem value="sk">Slovenčina</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-full justify-center"
              >
                {theme === 'light' ? <Moon /> : <Sun />}
              </Button>

              {session && (
                <Button onClick={handleLogout} className="w-full justify-center">
                  {t('logout')}
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}