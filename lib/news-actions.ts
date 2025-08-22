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

export async function createNews(formData: FormData) {
  const title = String(formData.get("title") || "").trim()
  const summary = String(formData.get("summary") || "").trim()
  const content = String(formData.get("content") || "").trim()
  const category = String(formData.get("category") || "general").trim()
  const priority = Number(formData.get("priority") || 1)
  const target_region = String(formData.get("target_region") || "").trim() || null
  const published = String(formData.get("published") || "false") === "true"

  // Optional link URLs
  const image_url_input = String(formData.get("image_url") || "").trim()
  const video_url_input = String(formData.get("video_url") || "").trim()
  const audio_url_input = String(formData.get("audio_url") || "").trim()

  // Optional file uploads
  const image_file = formData.get("image_file") as File | null
  const video_file = formData.get("video_file") as File | null
  const audio_file = formData.get("audio_file") as File | null

  const links_extra = String(formData.get("links") || "").trim()

  if (!title || !content) redirect("/news/create?error=Título e conteúdo são obrigatórios")

  const supabase = await createActionClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const authUser = user!

  const { data: me } = await supabase.from("profiles").select("role").eq("id", authUser.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/news?error=Acesso negado")

  // Upload helper
  async function uploadIfPresent(file: File | null): Promise<string | null> {
    if (!file || ("size" in file && (file as any).size === 0)) return null
    const path = `${authUser.id}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from("news").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: (file as any).type || undefined,
    })
    if (upErr) return null
    const { data: pub } = supabase.storage.from("news").getPublicUrl(path)
    return pub?.publicUrl || null
  }

  const [image_uploaded, video_uploaded, audio_uploaded] = await Promise.all([
    uploadIfPresent(image_file),
    uploadIfPresent(video_file),
    uploadIfPresent(audio_file),
  ])

  // Choose uploaded URL first, then manual URL
  const image_url = image_uploaded || image_url_input || null
  const video_url = video_uploaded || video_url_input || null
  const audio_url = audio_uploaded || audio_url_input || null

  // Append extra links to content if provided
  const final_content = links_extra
    ? `${content}\n\nLinks:\n${links_extra.split(/\r?\n/).filter(Boolean).join("\n")}`
    : content

  const { error } = await supabase.from("news").insert({
    title,
    content: final_content,
    summary: summary || null,
    image_url,
    video_url,
    audio_url,
    category,
    priority: isNaN(priority) ? 1 : priority,
    target_region,
    published,
    published_at: published ? new Date().toISOString() : null,
    created_by: authUser.id,
  })

  if (error) redirect(`/news/create?error=${encodeURIComponent(error.message)}`)
  redirect("/news?message=Publicação criada")
}