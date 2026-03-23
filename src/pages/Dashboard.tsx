import { useEffect } from 'react'
import { createClient } from '@/lib/client'

export default function Dashboard() {
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { error } = await supabase.auth.getUser()
      if (error) location.href = '/login'
    }
    checkAuth()
  }, [])

  return <div>Home</div>
}