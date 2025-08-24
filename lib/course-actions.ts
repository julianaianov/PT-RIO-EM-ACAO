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

async function requireCoordinator(supabase: ReturnType<typeof createServerClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/courses?error=Acesso negado")
  return user
}

type UploadedMeta = { file_url: string; mime_type?: string; size_bytes?: number; title?: string }

async function uploadToBucket(supabase: any, userId: string, file: File | null): Promise<UploadedMeta | null> {
  if (!file || ("size" in file && (file as any).size === 0)) return null
  const safeName = (file as any).name?.replace(/[^a-zA-Z0-9._-]/g, "_") || `file-${Date.now()}`
  const path = `${userId}/${Date.now()}-${safeName}`
  const arrayBuffer = await (file as any).arrayBuffer?.()
  const body = arrayBuffer || (file as any)
  const { error } = await supabase.storage.from("course-files").upload(path, body, {
    cacheControl: "3600",
    upsert: false,
    contentType: (file as any).type || undefined,
  })
  if (error) return null
  const { data } = supabase.storage.from("course-files").getPublicUrl(path)
  return { file_url: data?.publicUrl || path, mime_type: (file as any).type, size_bytes: (file as any).size, title: (file as any).name }
}

export async function createCourse(formData: FormData) {
  const supabase = await createActionClient()
  const user = await requireCoordinator(supabase as any)

  const title = String(formData.get("title") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const content = String(formData.get("content") || "").trim()
  const video_url = String(formData.get("video_url") || "").trim() || null
  const duration_minutes = Number(formData.get("duration_minutes") || 0) || null
  const points_reward = Number(formData.get("points_reward") || 10) || 10
  const difficulty = String(formData.get("difficulty") || "beginner")
  const category = String(formData.get("category") || "history")

  if (!title) redirect("/courses/create?error=Título é obrigatório")

  const { data: course, error } = await supabase
    .from("courses")
    .insert({
      title,
      description,
      content,
      video_url,
      duration_minutes,
      points_reward,
      difficulty,
      category,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (error || !course) redirect(`/courses/create?error=${encodeURIComponent(error?.message || "Erro ao criar curso")}`)

  // Links (one per line)
  const linksRaw = String(formData.get("links") || "").trim()
  const links = linksRaw
    ? linksRaw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http"))
    : []

  if (links.length > 0) {
    await supabase.from("course_links").insert(links.map((url) => ({ course_id: course.id, url })))
  }

  // Cover image (optional)
  const coverUploadedUrl = String(formData.get("cover_uploaded_url") || "").trim() || null
  const uploadedCover = coverUploadedUrl
    ? ({ file_url: coverUploadedUrl, mime_type: "image/*", size_bytes: 0, title: "cover" } as UploadedMeta)
    : null
  if (uploadedCover && (uploadedCover.mime_type || "").startsWith("image/")) {
    // reset previous covers
    await supabase.from("course_attachments").update({ is_cover: false }).eq("course_id", course.id)
    await supabase.from("course_attachments").insert({
      course_id: course.id,
      file_url: uploadedCover.file_url,
      mime_type: uploadedCover.mime_type,
      size_bytes: uploadedCover.size_bytes,
      title: uploadedCover.title,
      is_cover: true,
    })
  }

  // Attachments: up to three files for simplicity
  const files: (File | null)[] = [
    (formData.get("file1") as File) || null,
    (formData.get("file2") as File) || null,
    (formData.get("file3") as File) || null,
  ]

  const uploaded = await Promise.all(files.map((f) => uploadToBucket(supabase, user.id, f)))
  const rows = uploaded
    .filter(Boolean)
    .map((m) => ({ course_id: course.id, file_url: (m as UploadedMeta).file_url, mime_type: (m as UploadedMeta).mime_type, size_bytes: (m as UploadedMeta).size_bytes, title: (m as UploadedMeta).title }))
  if (rows.length > 0) {
    await supabase.from("course_attachments").insert(rows as any)
  }

  redirect(`/courses/${course.id}`)
}

export async function updateCourse(formData: FormData) {
  const supabase = await createActionClient()
  const user = await requireCoordinator(supabase as any)

  const course_id = String(formData.get("course_id") || "")
  if (!course_id) redirect("/courses?error=Curso inválido")

  const patch: any = {}
  for (const key of [
    "title",
    "description",
    "content",
    "video_url",
    "duration_minutes",
    "points_reward",
    "difficulty",
    "category",
  ]) {
    const val = formData.get(key)
    if (val !== null && String(val).length > 0) patch[key] = key.includes("duration") || key.includes("points") ? Number(val) : String(val)
  }

  if (Object.keys(patch).length > 0) {
    const { error } = await supabase.from("courses").update(patch).eq("id", course_id)
    if (error) redirect(`/courses/${course_id}/edit?error=${encodeURIComponent(error.message)}`)
  }

  // New links
  const linksRaw = String(formData.get("links") || "").trim()
  const links = linksRaw
    ? linksRaw
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => s.startsWith("http"))
    : []
  if (links.length > 0) {
    await supabase.from("course_links").insert(links.map((url) => ({ course_id, url })))
  }

  // New files
  const files: (File | null)[] = [
    (formData.get("file1") as File) || null,
    (formData.get("file2") as File) || null,
    (formData.get("file3") as File) || null,
  ]
  const uploaded = await Promise.all(files.map((f) => uploadToBucket(supabase, user.id, f)))
  const rows = uploaded
    .filter(Boolean)
    .map((m) => ({ course_id, file_url: (m as UploadedMeta).file_url, mime_type: (m as UploadedMeta).mime_type, size_bytes: (m as UploadedMeta).size_bytes, title: (m as UploadedMeta).title }))
  if (rows.length > 0) {
    await supabase.from("course_attachments").insert(rows as any)
  }

  // New cover image if provided
  const coverUploadedUrl = String(formData.get("cover_uploaded_url") || "").trim() || null
  const uploadedCover = coverUploadedUrl
    ? ({ file_url: coverUploadedUrl, mime_type: "image/*", size_bytes: 0, title: "cover" } as UploadedMeta)
    : null
  if (uploadedCover && (uploadedCover.mime_type || "").startsWith("image/")) {
    await supabase.from("course_attachments").update({ is_cover: false }).eq("course_id", course_id)
    await supabase.from("course_attachments").insert({
      course_id,
      file_url: uploadedCover.file_url,
      mime_type: uploadedCover.mime_type,
      size_bytes: uploadedCover.size_bytes,
      title: uploadedCover.title,
      is_cover: true,
    })
  }

  redirect(`/courses/${course_id}`)
} 

export async function updateCourseQuiz(formData: FormData) {
  const supabase = await createActionClient()
  const user = await requireCoordinator(supabase as any)

  const course_id = String(formData.get("course_id") || "")
  if (!course_id) redirect("/courses?error=Curso inválido")

  // Parse questions array from JSON
  const questionsRaw = String(formData.get("questions_json") || "[]")
  let questions: any[] = []
  try {
    questions = JSON.parse(questionsRaw)
  } catch (e) {
    redirect(`/courses/${course_id}/edit?error=Quiz inválido`)
  }

  // Remove existing and re-insert simple approach
  await supabase.from("course_quiz_questions").delete().eq("course_id", course_id)

  if (Array.isArray(questions) && questions.length > 0) {
    const rows = questions
      .filter((q) => q && q.question_text && q.correct_option)
      .map((q, idx) => ({
        course_id,
        question_text: String(q.question_text),
        option_a: String(q.option_a || ""),
        option_b: String(q.option_b || ""),
        option_c: q.option_c ? String(q.option_c) : null,
        option_d: q.option_d ? String(q.option_d) : null,
        correct_option: String(q.correct_option),
        sort_order: Number(q.sort_order ?? idx),
      }))
    if (rows.length > 0) {
      await supabase.from("course_quiz_questions").insert(rows as any)
    }
  }

  redirect(`/courses/${course_id}/edit?message=Quiz atualizado`)
}