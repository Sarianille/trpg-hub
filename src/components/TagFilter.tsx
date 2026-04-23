import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Filter } from 'lucide-react'

type TagFilterProps = {
  tags: string[]
  selectedTags: string[]
  onSelectTag: (tag: string) => void
  onClear: () => void
}

export function TagFilter({ tags, selectedTags, onSelectTag, onClear }: TagFilterProps) {
  const { t } = useTranslation()

  if (tags.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger 
        render={
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Filter />
            {selectedTags.length > 0 && <span className="">({selectedTags.length})</span>}
          </Button>
        } />
        <PopoverContent align="end">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">{t('tagFilter.title')}</h4>
              {selectedTags.length > 0 && (
                <Button variant="ghost" size="sm" onClick={onClear}>
                  {t('tagFilter.clear')}
                </Button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <Button key={tag} variant={selectedTags.includes(tag) ? 'default' : 'outline'} size="sm" onClick={() => onSelectTag(tag)}>
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
    </Popover>
  )
}