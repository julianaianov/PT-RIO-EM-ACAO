"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

function createActionClient() {
  return cookies().then((store) =>
    createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => store.getAll(),
          setAll: (all) => all.forEach(({ name, value, options }) => store.set({ name, value, ...options })),
        },
      }
    )
  )
}

export async function signIn(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")
  if (!email || !password) redirect("/auth/login?error=Email and password are required")

  const supabase = await createActionClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: String(email),
    password: String(password),
  })
  if (error) redirect(`/auth/login?error=${encodeURIComponent(error.message)}`)
  redirect("/")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")
  if (!email || !password) redirect("/auth/sign-up?error=Email and password are required")

  const supabase = await createActionClient()
  const { error } = await supabase.auth.signUp({
    email: String(email),
    password: String(password),
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      data: { full_name: String(fullName || "") },
    },
  })
  if (error) redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`)
  redirect("/auth/login?message=Check your email to confirm your account.")
}

export async function signOut() {
  const supabase = await createActionClient()
  await supabase.auth.signOut()
  redirect("/auth/login")
}
