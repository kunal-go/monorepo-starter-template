const ACCESS_TOKEN_KEY = 'accessToken'

type LogoutCallback = () => void

let logoutCallbacks: LogoutCallback[] = []
let isRefreshing = false
let refreshPromise: Promise<{ accessToken: string }> | null = null

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

  refreshToken: async (): Promise<{ accessToken: string }> => {
    // If already refreshing, return the existing promise
    if (isRefreshing && refreshPromise) {
      return refreshPromise
    }

    isRefreshing = true
    refreshPromise = new Promise(async (resolve, reject) => {
      console.log('Refreshing token')
      try {
        // Import env dynamically to avoid circular dependencies
        const { env } = await import('./env')

        // Make a direct fetch call to the refresh endpoint
        const response = await fetch(
          `${env.VITE_SERVER_URL}/trpc/user.refreshV1Mutation`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies for refresh token
            body: JSON.stringify({}),
          },
        )

        if (!response.ok) {
          throw new Error('Refresh failed')
        }

        const result = await response.json()

        if (result.result?.data) {
          // Update the stored access token
          auth.setToken(result.result.data.accessToken)
          resolve({ accessToken: result.result.data.accessToken })
        } else {
          throw new Error('Invalid refresh response')
        }
      } catch (error) {
        // If refresh fails, logout the user
        auth.logout()
        reject(error)
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })

    return refreshPromise
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
