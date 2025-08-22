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

export async function createEvent(formData: FormData) {
  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const event_date = String(formData.get("event_date") || "").trim()
  const location = String(formData.get("location") || "").trim()
  const city = String(formData.get("city") || "").trim()
  const neighborhood = String(formData.get("neighborhood") || "").trim()
  const event_type = String(formData.get("event_type") || "").trim()
  const max_participants = Number(formData.get("max_participants") || 0)

  if (!title || !event_date) redirect("/events/create?error=Título e data são obrigatórios")

  const supabase = await createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/events?error=Acesso negado")

  const { error } = await supabase.from("events").insert({
    title,
    description,
    event_date: new Date(event_date).toISOString(),
    location,
    city,
    neighborhood,
    event_type: event_type || null,
    max_participants: max_participants || null,
    created_by: user.id,
  })

  if (error) redirect(`/events/create?error=${encodeURIComponent(error.message)}`)
  redirect("/events?message=Evento criado")
} 