import type { AppRouter } from '@server/trpc/routers'
import { createTRPCReact } from '@trpc/react-query'

export type { AppRouter }
export const trpc = createTRPCReact<AppRouter>()
