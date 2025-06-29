const ACCESS_TOKEN_KEY = 'accessToken'

type LogoutCallback = () => void

let logoutCallbacks: LogoutCallback[] = []

export const auth = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  removeToken: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  },

  isAuthenticated: (): boolean => {
    return !!auth.getToken()
  },

  logout: (): void => {
    auth.removeToken()
    // Execute all registered logout callbacks
    logoutCallbacks.forEach((callback) => callback())
  },

  onLogout: (callback: LogoutCallback): void => {
    logoutCallbacks.push(callback)
  },

  removeLogoutCallback: (callback: LogoutCallback): void => {
    logoutCallbacks = logoutCallbacks.filter((cb) => cb !== callback)
  },
}
