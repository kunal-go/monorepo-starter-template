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
    }),
  ],
})
