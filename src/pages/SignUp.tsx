import { useAuthGuard } from '@/hooks/useAuthGuard'
import { SignUpForm } from '@/components/sign-up-form'
import { PageSkeleton } from '@/components/PageSkeleton'

export default function SignUp() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  
  if (isChecking) return <PageSkeleton />

  return <SignUpForm />
}