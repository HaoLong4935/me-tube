"use client"
import { httpBatchLink } from "@trpc/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppRouter } from "./routers/_app"
import { createTRPCReact } from "@trpc/react-query"
import { makeQueryClient } from "./query-client";
import { useState } from "react";
import superjson from "superjson"

export const trpc = createTRPCReact<AppRouter>()
let clientQueryClientSingleton: QueryClient;
function getQueryClient() {
    if (typeof window === 'undefined') {
        //Server: Server always make a new query client
        return makeQueryClient()
    }
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= makeQueryClient())
}
function getUrl() {
    const base = (() => {
        if (typeof window !== 'undefined') return '';
        if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
        return "http://localhost:3000"
    })()
    return `${base}/api/trpc`
}

export function TRPCProvider(
    props: Readonly<{
        children: React.ReactNode;
    }>,
) {
    const queryClient = getQueryClient()
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    transformer: superjson,
                    url: getUrl(),
                    async headers() {
                        const headers = new Headers()
                        headers.set("x-trpc-source", "nextjs-react")
                        return headers
                    }
                })
            ]
        })
    );
    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                {props.children}
            </QueryClientProvider>
        </trpc.Provider>
    )
}