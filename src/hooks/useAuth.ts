'use client'

import { authClient } from "@/lib/auth-client"

export const useAuth = () => {
  const { data : session , isPending, error } = authClient.useSession()

  return {
    user : session?.user ?? null,
    loading : isPending,
    isAuthenticated: !!session?.user,
  }
}

