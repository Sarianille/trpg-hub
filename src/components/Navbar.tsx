import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/client'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  
  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.href = '/login'
  }

  return (
  <div className="flex items-center justify-between p-3">
    <div>TRPG hub</div>
    <div className="flex items-center gap-2">
      <Button size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? <Moon /> : <Sun />}
      </Button>
      <Button onClick={handleLogout}>
        Sign Out
      </Button>
    </div>
  </div>
  )
}