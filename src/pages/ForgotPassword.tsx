import { useAuthGuard } from '@/hooks/useAuthGuard'
import { ForgotPasswordForm } from '@/components/forgot-password-form'
import { PageSkeleton } from '@/components/PageSkeleton'

export default function ForgotPassword() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  
  if (isChecking) return <PageSkeleton />

  return <ForgotPasswordForm />
}