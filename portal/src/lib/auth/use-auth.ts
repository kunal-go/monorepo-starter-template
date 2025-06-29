import { useAuthStore } from './auth-store'
import { auth } from './auth'

export function useAuth() {
  const { accessToken, isInitialized, isAuthenticated } = useAuthStore()

  return {
    accessToken,
    isInitialized,
    isAuthenticated: isAuthenticated(),
    setToken: auth.setToken,
    removeToken: auth.removeToken,
    logout: auth.logout,
    refreshToken: auth.refreshToken,
  }
}
