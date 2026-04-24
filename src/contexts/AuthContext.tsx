import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/client"
import type { ReactNode } from "react"
import type { Session, User } from "@supabase/supabase-js"

type AuthContextValue = {
  session: Session | null
  user: User | null
  isChecking: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (cancelled) return
      setSession(session)
      setIsChecking(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (cancelled) return
      setSession(session)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (session?.access_token) {
      supabase.realtime.setAuth(session.access_token)
    }
  }, [session?.access_token])

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, isChecking }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}