import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import { useAuth } from "@/contexts/AuthContext"
import type { ReactNode } from "react"
import type { TagColor } from "@/lib/tagColors"

type Preferences = { tagColors?: Record<string, TagColor> }

type PreferencesContextValue = {
  tagColors: Record<string, TagColor>
  setTagColor: (tag: string, color: TagColor | undefined) => void
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<Preferences>({})

  useEffect(() => {
    if (!user) return

    supabase
      .from('profiles')
      .select('preferences')
      .eq('id', user.id)
      .single()
      .then(({ data }) => setPreferences(data?.preferences || {}))
    }, [user])

    const setTagColor = (tag: string, color: TagColor | undefined) => {
      const newTagColors = { ...preferences.tagColors }
      if (color === undefined) delete newTagColors[tag]
      else newTagColors[tag] = color

      const newPreferences = { ...preferences, tagColors: newTagColors }
      setPreferences(newPreferences)

      supabase
        .from('profiles')
        .update({ preferences: newPreferences })
        .eq('id', user!.id)
    }

  return (
    <PreferencesContext.Provider value={{ tagColors: preferences.tagColors || {}, setTagColor }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error("usePreferences must be used within a PreferencesProvider")
  return context
}