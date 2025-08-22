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

export async function createNucleo(formData: FormData) {
  const supabase = await createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/nucleos?error=Acesso negado")

  const payload = {
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    city: String(formData.get("city") || "").trim(),
    neighborhood: String(formData.get("neighborhood") || "").trim() || null,
    address: String(formData.get("address") || "").trim() || null,
    contact_name: String(formData.get("contact_name") || "").trim() || null,
    contact_phone: String(formData.get("contact_phone") || "").trim() || null,
    contact_email: String(formData.get("contact_email") || "").trim() || null,
    whatsapp_link: String(formData.get("whatsapp_link") || "").trim() || null,
    telegram_link: String(formData.get("telegram_link") || "").trim() || null,
  }

  if (!payload.name || !payload.city) redirect("/nucleos/create?error=Nome e cidade são obrigatórios")

  const { data, error } = await supabase.from("nucleos").insert(payload).select("id").single()
  if (error || !data) redirect(`/nucleos/create?error=${encodeURIComponent(error?.message || "Erro ao criar núcleo")}`)

  redirect(`/nucleos/${data.id}`)
} 