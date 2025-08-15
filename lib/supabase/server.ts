import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

export const createClient = cache(async () => {
  const store = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: () => {},
      },
    }
  )
})
