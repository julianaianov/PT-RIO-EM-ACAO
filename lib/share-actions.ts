"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

async function requireCoordinatorOrAdmin(redirectTo: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?error=Login necessário&next=${redirectTo}`)
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect(`${redirectTo}?error=Acesso negado`)
  return supabase
}

export async function createShareLink(formData: FormData) {
  const supabase = await requireCoordinatorOrAdmin("/admin/share-links")
  
  const payload = {
    label: String(formData.get("label") || "").trim(),
    path: String(formData.get("path") || "").trim(),
    message: String(formData.get("message") || "").trim() || null,
    icon: String(formData.get("icon") || "Share2").trim(),
    color: String(formData.get("color") || "text-red-600").trim(),
    order_index: Number(formData.get("order_index") || 0),
    active: String(formData.get("active") || "true") === "true",
  }

  if (!payload.label || !payload.path) {
    redirect("/admin/share-links?error=Label e Path são obrigatórios")
  }

  const { error } = await supabase.from("share_links").insert(payload)
  if (error) redirect(`/admin/share-links?error=${encodeURIComponent(error.message)}`)
  
  redirect("/admin/share-links?message=Link criado com sucesso")
}

export async function updateShareLink(formData: FormData) {
  const supabase = await requireCoordinatorOrAdmin("/admin/share-links")
  
  const id = String(formData.get("id") || "")
  if (!id) redirect("/admin/share-links?error=ID não fornecido")

  const payload = {
    label: String(formData.get("label") || "").trim(),
    path: String(formData.get("path") || "").trim(),
    message: String(formData.get("message") || "").trim() || null,
    icon: String(formData.get("icon") || "Share2").trim(),
    color: String(formData.get("color") || "text-red-600").trim(),
    order_index: Number(formData.get("order_index") || 0),
    active: String(formData.get("active") || "true") === "true",
  }

  if (!payload.label || !payload.path) {
    redirect("/admin/share-links?error=Label e Path são obrigatórios")
  }

  const { error } = await supabase.from("share_links").update(payload).eq("id", id)
  if (error) redirect(`/admin/share-links?error=${encodeURIComponent(error.message)}`)
  
  redirect("/admin/share-links?message=Link atualizado com sucesso")
}

export async function deleteShareLink(formData: FormData) {
  const supabase = await requireCoordinatorOrAdmin("/admin/share-links")
  
  const id = String(formData.get("id") || "")
  if (!id) redirect("/admin/share-links?error=ID não fornecido")

  const { error } = await supabase.from("share_links").delete().eq("id", id)
  if (error) redirect(`/admin/share-links?error=${encodeURIComponent(error.message)}`)
  
  redirect("/admin/share-links?message=Link excluído com sucesso")
}
