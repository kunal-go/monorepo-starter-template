import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../../server/src/trpc/routers'
import { auth } from './auth'
import { env } from './env'

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
