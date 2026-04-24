import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

type AuthGuardOptions = {
    requireAuth: boolean
    redirectTo: string
}

export function useAuthGuard({ requireAuth, redirectTo }: AuthGuardOptions) {
  const { user, isChecking } = useAuth()
  const navigate = useNavigate()

  const shouldRedirect = !isChecking && (requireAuth ? !user : !!user)

  useEffect(() => {
    if (shouldRedirect) navigate(redirectTo)
  }, [shouldRedirect, navigate, redirectTo])

  // Ensure components won't flash content after checking but before redirecting
  return isChecking || shouldRedirect
}