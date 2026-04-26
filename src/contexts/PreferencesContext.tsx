import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import { useAuth } from "@/contexts/AuthContext"
import type { ReactNode } from "react"
import type { TagColor } from "@/lib/tagColors"

type Preferences = { tagColors?: Record<string, TagColor> }

type PreferencesContextValue = {
  tagColors: Record<string, TagColor>
  setTagColor: (tag: string, color: TagColor | undefined) => void
  error: string | null
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<Preferences>({})
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    let cancelled = false

    const loadPreferences = async () => {
      setError(null)

      try {
        const {data, error} = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single()

          if (error) throw error
          if (!cancelled) setPreferences(data?.preferences || {})
      } catch (error: unknown) {
        if (!cancelled) setError(error instanceof Error ? error.message : 'generic')
      }
    }

    loadPreferences()

    return () => { cancelled = true }
  }, [user])

    const setTagColor = async (tag: string, color: TagColor | undefined) => {
      setError(null)

      const newTagColors = { ...preferences.tagColors }
      if (color === undefined) delete newTagColors[tag]
      else newTagColors[tag] = color

      const newPreferences = { ...preferences, tagColors: newTagColors }
      const oldPreferences = preferences
      setPreferences(newPreferences)

      try {
        const { error } = await supabase
          .from('profiles')
          .update({ preferences: newPreferences })
          .eq('id', user!.id)

        if (error) throw error
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'generic')
        setPreferences(oldPreferences)
      }
    }

  return (
    <PreferencesContext.Provider value={{ tagColors: preferences.tagColors || {}, setTagColor, error }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences() {
  const context = useContext(PreferencesContext)
  if (!context) throw new Error("usePreferences must be used within a PreferencesProvider")
  return context
}