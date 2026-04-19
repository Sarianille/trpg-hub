import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/client'

type AuthGuardOptions = {
    requireAuth: boolean
    redirectTo: string
}

export function useAuthGuard({ requireAuth, redirectTo }: AuthGuardOptions) {
  const [isChecking, setIsChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const shouldRedirect = requireAuth ? !user : !!user
      if (shouldRedirect) navigate(redirectTo)
      else setIsChecking(false)
    }
    checkAuth()
  }, [navigate, requireAuth, redirectTo])

  return isChecking
}