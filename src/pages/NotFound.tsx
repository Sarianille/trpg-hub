import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[calc(100vh-56px)] px-4 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold">{t('notFound.title')}</h2>
      <p className="text-lg text-muted-foreground">{t('notFound.description')}</p>
      <Button onClick={() => navigate('/')}>{t('notFound.goHome')}</Button>
    </div>
  )
}