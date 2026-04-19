import { useAuthGuard } from '@/hooks/useAuthGuard'
import { LoginForm } from '@/components/login-form'
import { PageSkeleton } from '@/components/PageSkeleton'

export default function Login() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  
  if (isChecking) return <PageSkeleton />

  return <LoginForm />
}