import { createTRPCRouter } from "../../trpc"
import { check } from "./handlers/check"

export const healthRouter = createTRPCRouter({
	check,
})
