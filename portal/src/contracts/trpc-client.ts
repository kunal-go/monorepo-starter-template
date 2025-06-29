import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { auth } from '../lib/auth'
import { env } from '../lib/env'
import type { AppRouter } from './trpc'

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${env.VITE_SERVER_URL}/trpc`,
      headers: () => {
        const token = auth.getToken()
        return token
          ? { authorization: `Bearer ${token}`, credentials: 'include' }
          : {}
      },
      fetch: async (url, options) => {
        const response = await fetch(url, {
          ...options,
          credentials: 'include',
        })

        // Handle 401 errors with "Access token expired" message
        if (response.status === 401) {
          const responseText = await response.text()

          // Check if the error message indicates token expiration
          if (responseText.includes('Access token expired')) {
            try {
              // Try to refresh the token
              await auth.refreshToken()

              // Retry the original request with the new token
              const newToken = auth.getToken()
              if (newToken && options) {
                const newOptions = {
                  ...options,
                  headers: {
                    ...options.headers,
                    authorization: `Bearer ${newToken}`,
                  },
                }

                return await fetch(url, {
                  ...newOptions,
                  credentials: 'include',
                })
              }
            } catch (refreshError) {
              // If refresh fails, logout the user
              console.log('Token refresh failed, logging out')
              auth.logout()
            }
          }
        }

        return response
      },
    }),
  ],
})
