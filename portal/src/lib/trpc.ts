import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../../server/src/trpc/routers'

export const trpc = createTRPCReact<AppRouter>()
