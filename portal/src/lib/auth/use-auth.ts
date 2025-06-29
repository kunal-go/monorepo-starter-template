import { useAuthStore } from './auth-store'
import { auth } from './auth'
import { useState } from 'react'

export function useAuth() {
  const { accessToken, isInitialized, isAuthenticated } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const logout = async () => {
    setIsLoggingOut(true)
    try {
      await auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
      // Re-throw the error so components can handle it
      throw error
    } finally {
      setIsLoggingOut(false)
    }
  }

  return {
    accessToken,
    isInitialized,
    isAuthenticated: isAuthenticated(),
    setToken: auth.setToken,
    removeToken: auth.removeToken,
    logout,
    isLoggingOut,
    refreshToken: auth.refreshToken,
  }
}
