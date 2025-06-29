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
        return token ? { authorization: `Bearer ${token}` } : {}
      },
      fetch: async (url, options) => {
        const response = await fetch(url, options)

        // Check if the response indicates an unauthorized error
        if (response.status === 401) {
          console.log('Logging out on unauthorized error')
          // Auto logout on unauthorized error
          auth.logout()
        }

        return response
      },
    }),
  ],
})
