import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (all) => all.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    }
  )

  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
    return NextResponse.redirect(new URL("/", request.url))
  }

  await supabase.auth.getSession()
  return res
}
