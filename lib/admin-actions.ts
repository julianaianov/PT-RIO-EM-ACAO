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

export async function updateUserRole(formData: FormData) {
  const userId = String(formData.get("user_id") || "")
  const role = String(formData.get("role") || "member")

  const supabase = await createActionClient()

  // Ensure caller is admin
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") redirect("/?error=Acesso negado")

  await supabase.from("profiles").update({ role }).eq("id", userId)

  redirect("/admin/users")
} 

export async function createShareItem(formData: FormData) {
  const supabase = await createActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin" && me?.role !== "coordinator") redirect("/admin/share?error=Acesso negado")

  const title = String(formData.get("title") || "").trim()
  const summary = String(formData.get("summary") || "").trim()
  const image_url = String(formData.get("image_url") || "").trim()
  const target_url = String(formData.get("target_url") || "").trim()
  if (!title || !target_url) redirect("/admin/share?error=Preencha título e URL")

  await supabase.from("share_items").insert({ title, summary, image_url, target_url, created_by: user.id })

  redirect("/admin/share?message=Criado")
}

export async function deleteShareItem(formData: FormData) {
  const supabase = await createActionClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin" && me?.role !== "coordinator") redirect("/admin/share?error=Acesso negado")

  const id = String(formData.get("id") || "")
  if (!id) redirect("/admin/share?error=ID inválido")

  await supabase.from("share_items").delete().eq("id", id)
  redirect("/admin/share?message=Excluído")
}