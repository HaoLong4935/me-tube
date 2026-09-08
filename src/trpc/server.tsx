import "server-only"
import { createHydrationHelpers } from "@trpc/react-query/rsc"
import { makeQueryClient } from "./query-client"
import { createCallerFactory, createTRPCContext, } from "./init"
import { appRouter } from "./routers/_app"
import { cache } from "react"

export const getQueryClient = cache(makeQueryClient)
const caller = createCallerFactory(appRouter)(createTRPCContext)
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
    caller,
    getQueryClient
)
