import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences } from '@/contexts/PreferencesContext'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Palette } from 'lucide-react'
import { TAG_COLORS, TAG_SWATCH_HEX } from '@/lib/tagColors'
import type { TagColor } from '@/lib/tagColors'

type TagColorManagerProps = {
  tags: string[]
}

export function TagColorManager({ tags }: TagColorManagerProps) {
  const { tagColors, setTagColor, error } = usePreferences();
  const [expandedTag, setExpandedTag] = useState<string | null>(null)

  const { t } = useTranslation()

  if (tags.length === 0) return null

  return (
    <Popover>
      <PopoverTrigger 
        render={
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Palette />
          </Button>
        } />
        <PopoverContent align="end">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">{t('tagColorManager.title')}</h4>
            </div>
            <div className="flex flex-col gap-1">
              {tags.map(tag => {
                const isExpanded = expandedTag === tag
                const current = tagColors[tag]

                return (
                  <div key={tag} className="flex flex-col">
                    <Button variant="ghost" size="sm" onClick={() => setExpandedTag(isExpanded ? null : tag)} className="justify-between">
                      <span>{tag}</span>
                      {current ? (
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TAG_SWATCH_HEX[current] }} />
                      ) : (
                        <span className="h-3 w-3 rounded-full border border-dashed border-muted-foreground" />
                      )}
                    </Button>
                    {isExpanded && (
                      <div className="flex flex-wrap gap-2 px-2 py-2">
                        {(Object.keys(TAG_COLORS) as TagColor[]).map(colorName => (
                          <button 
                            key={colorName} 
                            type="button" 
                            onClick={() => setTagColor(tag, colorName)} 
                            className="h-6 w-6 rounded-full hover:scale-110 transition transform"
                            style={{
                              backgroundColor: TAG_SWATCH_HEX[colorName],
                              outline: current === colorName ? '2px solid currentColor' : 'none',
                              outlineOffset: '2px',
                            }}
                          />
                        ))}
                        {current && (
                          <Button variant="ghost" size="sm" onClick={() => setTagColor(tag, undefined)}>
                            {t('tagColorManager.clear')}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {error && <p className="text-sm text-red-500">{error === 'generic' ? t('tagColorManager.error') : error}</p>}
          </div>
        </PopoverContent>
    </Popover>
  )
}