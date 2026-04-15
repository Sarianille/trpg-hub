import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'
import { supabase } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { t } = useTranslation()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== repeatPassword) {
      setError(t('signUp.passwordsDoNotMatch'))
      return
    }
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('signUp.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 min-h-screen items-center justify-center', className)} {...props}>
      {success ? (
        <Card className="w-5/6 md:w-100">
          <CardHeader>
            <CardTitle className="text-2xl">{t('signUp.successTitle')}</CardTitle>
            <CardDescription>{t('signUp.successDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('signUp.successMessage')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-5/6 md:w-100">
          <CardHeader>
            <CardTitle className="text-2xl">{t('signUp.title')}</CardTitle>
            <CardDescription>{t('signUp.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('signUp.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('signUp.emailPlaceholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">{t('signUp.password')}</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="repeat-password">{t('signUp.repeatPassword')}</Label>
                  </div>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('signUp.submitting') : t('signUp.submit')}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t('signUp.alreadyHaveAccount')}{' '}
                <a href="/login" className="underline underline-offset-4">
                  {t('signUp.login')}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
