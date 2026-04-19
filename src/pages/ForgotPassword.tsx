import { useAuthGuard } from '@/hooks/useAuthGuard'
import { ForgotPasswordForm } from '@/components/forgot-password-form'

export default function ForgotPassword() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  if (isChecking) return null

  return <ForgotPasswordForm />
}