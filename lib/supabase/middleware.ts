import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next()

  const urlEnv = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonEnv = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!urlEnv || !anonEnv) {
    // In production, if envs are missing, do not block the request
    return res
  }

  try {
    const supabase = createServerClient(urlEnv, anonEnv, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (all) => all.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    })

    const url = new URL(request.url)
    const code = url.searchParams.get("code")
    if (code) {
      await supabase.auth.exchangeCodeForSession(code)
      return NextResponse.redirect(new URL("/", request.url))
    }

    await supabase.auth.getSession()
    return res
  } catch (_) {
    // Fail-open: never break the app due to middleware error
    return res
  }
}
