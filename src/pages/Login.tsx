import { useAuthGuard } from '@/hooks/useAuthGuard'
import { LoginForm } from '@/components/login-form'

export default function Login() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  if (isChecking) return null

  return <LoginForm />
}