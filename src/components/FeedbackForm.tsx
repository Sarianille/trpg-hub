import { useState } from "react"
import { supabase } from "@/lib/client"
import { useTranslation } from "react-i18next"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


export function FeedbackForm() {
  const [message, setMessage] = useState('')
  const [type, setType] = useState('feedback')
  const [attachments, setAttachments] = useState<File[]>([])
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { t } = useTranslation()

  const toBase64 = (file: File) => new Promise<string>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve((reader.result as string).split(',')[1])
    reader.readAsDataURL(file)
  })

  const handleFeedbackSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if(!message.trim()) {
      setError(t('feedback.messageRequired'))
      return
    }

    setIsLoading(true)

    try {
      const base64Attachments = await Promise.all(
        attachments.map(async (file) => ({
          filename: file.name,
          content: await toBase64(file)
        }))
      )

      const { error } = await supabase.functions.invoke('send-feedback', {
        body: { message, type, attachments: base64Attachments }
      }) 

      if (error) throw error
      setMessage('')
      setAttachments([])
      setOpen(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : t('feedback.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form id="feedback-form" onSubmit={handleFeedbackSubmit}>
        <DialogTrigger render={<Button>{t('feedback.trigger')}</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('feedback.title')}</DialogTitle>
            <DialogDescription>{t('feedback.description')}</DialogDescription>
          </DialogHeader>
          <Label>{t('feedback.typeLabel')}</Label>
          <RadioGroup value={type} onValueChange={(value) => setType(value)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="bug" id="bug-type" />
              <Label htmlFor="bug-type">{t('feedback.bug')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="suggestion" id="suggestion-type" />
              <Label htmlFor="suggestion-type">{t('feedback.suggestion')}</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="feedback" id="feedback-type" />
              <Label htmlFor="feedback-type">{t('feedback.feedback')}</Label>
            </div>
          </RadioGroup>
          <Label htmlFor="message">{t('feedback.messageLabel')}</Label>
          <Textarea
          id="message"
          placeholder={t('feedback.messagePlaceholder')}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          />
          <Label htmlFor="attachments">{t('feedback.attachmentsLabel')}</Label>
          <Input
          id="attachments"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setAttachments(Array.from(e.target.files || []))}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <DialogFooter>
            <DialogClose render={<Button variant="outline">{t('feedback.close')}</Button>} />
            <Button type="submit" form="feedback-form" disabled={isLoading}>
              {isLoading ? t('feedback.submitting') : t('feedback.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}