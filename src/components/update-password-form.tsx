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

export function UpdatePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      location.href = '/'
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('updatePassword.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 min-h-screen items-center justify-center', className)} {...props}>
      <Card className="w-5/6 md:w-100">
        <CardHeader>
          <CardTitle className="text-2xl">{t('updatePassword.title')}</CardTitle>
          <CardDescription>{t('updatePassword.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">{t('updatePassword.newPassword')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('updatePassword.newPasswordPlaceholder')}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t('updatePassword.submitting') : t('updatePassword.submit')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
