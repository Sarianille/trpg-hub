import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/client'

export function Navbar() {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.href = '/login'
  }

  return (
  <div className="flex items-center justify-between p-3">
    <div>Home</div>
    <Button onClick={handleLogout}>
      Sign Out
    </Button>
  </div>
  )
}