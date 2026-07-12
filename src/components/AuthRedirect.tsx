'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AuthRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (!isSupabaseConfigured) return

    if (window.location.hash?.includes('access_token')) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          router.replace('/admin')
        }
      })
      return () => subscription.unsubscribe()
    }
  }, [router])

  return null
}
