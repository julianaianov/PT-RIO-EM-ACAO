"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function createActionClient() {
	const store = await cookies()
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: () => store.getAll(),
				setAll: (all) => all.forEach(({ name, value, options }) => store.set({ name, value, ...options })),
			},
		}
	)
}

async function requireCoordinatorOrAdmin(pathOnFail: string) {
	const supabase = await createActionClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) redirect(`/auth/login?error=Login necessário`)
	const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
	if (!me || !["coordinator", "admin"].includes(me.role)) redirect(`${pathOnFail}?error=Acesso negado`)
	return supabase
}

// Youth Events
export async function createYouthEvent(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		event_date: new Date(String(formData.get("event_date") || new Date())).toISOString(),
		location: String(formData.get("location") || "").trim(),
		category: String(formData.get("category") || "").trim(),
		participants: Number(formData.get("participants") || 0),
		max_participants: Number(formData.get("max_participants") || 0) || null,
		event_type: String(formData.get("event_type") || "").trim(),
		organizer: String(formData.get("organizer") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	if (!payload.title) redirect(`/youth/admin?error=Título obrigatório`)
	const { error } = await supabase.from("youth_events").insert(payload)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Evento criado`)
}

export async function updateYouthEvent(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	if (!id) redirect(`/youth/admin?error=ID inválido`)
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		event_date: new Date(String(formData.get("event_date") || new Date())).toISOString(),
		location: String(formData.get("location") || "").trim(),
		category: String(formData.get("category") || "").trim(),
		participants: Number(formData.get("participants") || 0),
		max_participants: Number(formData.get("max_participants") || 0) || null,
		event_type: String(formData.get("event_type") || "").trim(),
		organizer: String(formData.get("organizer") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	const { error } = await supabase.from("youth_events").update(payload).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Evento atualizado`)
}

export async function deleteYouthEvent(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_events").delete().eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Evento excluído`)
}

// Mentorships
export async function createYouthMentorship(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		duration: String(formData.get("duration") || "").trim(),
		mentors: Number(formData.get("mentors") || 0),
		mentees: Number(formData.get("mentees") || 0),
		next_cohort: String(formData.get("next_cohort") || "").trim(),
		level: String(formData.get("level") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	if (!payload.title) redirect(`/youth/admin?error=Título obrigatório`)
	const { error } = await supabase.from("youth_mentorships").insert(payload)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Mentoria criada`)
}

export async function updateYouthMentorship(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		duration: String(formData.get("duration") || "").trim(),
		mentors: Number(formData.get("mentors") || 0),
		mentees: Number(formData.get("mentees") || 0),
		next_cohort: String(formData.get("next_cohort") || "").trim(),
		level: String(formData.get("level") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	const { error } = await supabase.from("youth_mentorships").update(payload).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Mentoria atualizada`)
}

export async function deleteYouthMentorship(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_mentorships").delete().eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Mentoria excluída`)
}

// Groups
export async function createYouthGroup(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const payload = {
		name: String(formData.get("name") || "").trim(),
		members: Number(formData.get("members") || 0),
		last_activity: String(formData.get("last_activity") || "").trim(),
		topic: String(formData.get("topic") || "").trim(),
		color: String(formData.get("color") || "").trim(),
		motive: String(formData.get("motive") || "").trim() || null,
		purpose: String(formData.get("purpose") || "").trim() || null,
		active: String(formData.get("active") || "true") === "true",
	}
	if (!payload.name) redirect(`/youth/admin?error=Nome obrigatório`)
	const { error } = await supabase.from("youth_groups").insert(payload)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Grupo criado`)
}

export async function updateYouthGroup(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const payload = {
		name: String(formData.get("name") || "").trim(),
		members: Number(formData.get("members") || 0),
		last_activity: String(formData.get("last_activity") || "").trim(),
		topic: String(formData.get("topic") || "").trim(),
		color: String(formData.get("color") || "").trim(),
		motive: String(formData.get("motive") || "").trim() || null,
		purpose: String(formData.get("purpose") || "").trim() || null,
		active: String(formData.get("active") || "true") === "true",
	}
	const { error } = await supabase.from("youth_groups").update(payload).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Grupo atualizado`)
}

export async function deleteYouthGroup(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_groups").delete().eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Grupo excluído`)
}

// Toggle group active (close/open debate)
export async function setYouthGroupActive(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const active = String(formData.get("active") || "true") === "true"
	const { error } = await supabase.from("youth_groups").update({ active }).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=${active ? "Debate reaberto" : "Debate encerrado"}`)
}

// Leaders
export async function createYouthLeader(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const payload = {
		name: String(formData.get("name") || "").trim(),
		role: String(formData.get("role") || "").trim(),
		age: Number(formData.get("age") || 0) || null,
		focus: String(formData.get("focus") || "").trim(),
		image_url: String(formData.get("image_url") || "").trim() || null,
		active: String(formData.get("active") || "true") === "true",
	}
	if (!payload.name) redirect(`/youth/admin?error=Nome obrigatório`)
	const { error } = await supabase.from("youth_leaders").insert(payload)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Liderança criada`)
}

export async function updateYouthLeader(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const payload = {
		name: String(formData.get("name") || "").trim(),
		role: String(formData.get("role") || "").trim(),
		age: Number(formData.get("age") || 0) || null,
		focus: String(formData.get("focus") || "").trim(),
		image_url: String(formData.get("image_url") || "").trim() || null,
		active: String(formData.get("active") || "true") === "true",
	}
	const { error } = await supabase.from("youth_leaders").update(payload).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Liderança atualizada`)
}

export async function deleteYouthLeader(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_leaders").delete().eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Liderança excluída`)
}

// Opportunities
export async function createYouthOpportunity(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		org: String(formData.get("org") || "").trim(),
		deadline: String(formData.get("deadline") || "").trim() || null,
		opportunity_type: String(formData.get("opportunity_type") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	if (!payload.title) redirect(`/youth/admin?error=Título obrigatório`)
	const { error } = await supabase.from("youth_opportunities").insert(payload)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Oportunidade criada`)
}

export async function updateYouthOpportunity(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const payload = {
		title: String(formData.get("title") || "").trim(),
		description: String(formData.get("description") || "").trim(),
		org: String(formData.get("org") || "").trim(),
		deadline: String(formData.get("deadline") || "").trim() || null,
		opportunity_type: String(formData.get("opportunity_type") || "").trim(),
		active: String(formData.get("active") || "true") === "true",
	}
	const { error } = await supabase.from("youth_opportunities").update(payload).eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Oportunidade atualizada`)
}

export async function deleteYouthOpportunity(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/youth/admin")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_opportunities").delete().eq("id", id)
	if (error) redirect(`/youth/admin?error=${encodeURIComponent(error.message)}`)
	redirect(`/youth/admin?message=Oportunidade excluída`)
}

// Mentor/Mentee applications admin actions
export async function deleteMentorApplication(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/admin/youth")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_mentor_applications").delete().eq("id", id)
	if (error) redirect(`/admin/youth?error=${encodeURIComponent(error.message)}`)
	redirect(`/admin/youth?message=Inscrição de mentor removida`)
}

export async function deleteMentorshipApplication(formData: FormData) {
	const supabase = await requireCoordinatorOrAdmin("/admin/youth")
	const id = String(formData.get("id") || "").trim()
	const { error } = await supabase.from("youth_mentorship_applications").delete().eq("id", id)
	if (error) redirect(`/admin/youth?error=${encodeURIComponent(error.message)}`)
	redirect(`/admin/youth?message=Candidatura removida`)
} 