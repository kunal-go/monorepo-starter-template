const ACCESS_TOKEN_KEY = 'accessToken'

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
}
