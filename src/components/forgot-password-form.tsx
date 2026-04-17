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

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_SITE_URL}/update-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('forgotPassword.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 min-h-[calc(100vh-130px)] items-center justify-center', className)} {...props}>
      {success ? (
        <Card className="w-5/6 md:w-100">
          <CardHeader>
            <CardTitle className="text-2xl">{t('forgotPassword.successTitle')}</CardTitle>
            <CardDescription>{t('forgotPassword.successDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {t('forgotPassword.successMessage')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-5/6 md:w-100">
          <CardHeader>
            <CardTitle className="text-2xl">{t('forgotPassword.title')}</CardTitle>
            <CardDescription>
              {t('forgotPassword.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('forgotPassword.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('forgotPassword.emailPlaceholder')}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                {t('forgotPassword.alreadyHaveAccount')}{' '}
                <a href="/login" className="underline underline-offset-4">
                  {t('forgotPassword.login')}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
