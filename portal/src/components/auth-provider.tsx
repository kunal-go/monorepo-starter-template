import { useEffect, type ReactNode } from 'react'
import { auth } from '../lib/auth/auth'
import { useAuthStore } from '../lib/auth/auth-store'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isInitialized } = useAuthStore()

  useEffect(() => {
    // Initialize auth state on component mount
    auth.initialize()
  }, [])

  // Show loading state while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
