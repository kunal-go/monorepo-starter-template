import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { trpc } from '@/contracts/trpc'
import { trpcClient } from '@/contracts/trpc-client'
import { auth } from '@/lib/auth'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const navigate = useNavigate()
  const [queryClient] = useState(() => new QueryClient())
  const [trpcClientInstance] = useState(() => trpcClient)

  // Register logout callback to redirect to login
  useEffect(() => {
    const logoutCallback = () => {
      navigate({ to: '/login' })
    }

    auth.onLogout(logoutCallback)

    return () => {
      auth.removeLogoutCallback(logoutCallback)
    }
  }, [navigate])

  return (
    <trpc.Provider client={trpcClientInstance} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <TanStackRouterDevtools />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
