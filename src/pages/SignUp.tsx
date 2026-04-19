import { useAuthGuard } from '@/hooks/useAuthGuard'
import { SignUpForm } from '@/components/sign-up-form'

export default function SignUp() {
  const isChecking = useAuthGuard({ requireAuth: false, redirectTo: '/' })
  if (isChecking) return null

  return <SignUpForm />
}