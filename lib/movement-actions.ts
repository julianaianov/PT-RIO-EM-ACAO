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

export async function createMovement(formData: FormData) {
	const name = String(formData.get("name") || "").trim()
	const description = String(formData.get("description") || "").trim()
	const category = String(formData.get("category") || "").trim()
	const region = String(formData.get("region") || "").trim()
	const founded = String(formData.get("founded") || "").trim()
	const members = Number(formData.get("members") || 0)
	const whatsapp = String(formData.get("whatsapp") || "").trim()
	const instagram = String(formData.get("instagram") || "").trim()
	const facebook = String(formData.get("facebook") || "").trim()
	const email = String(formData.get("email") || "").trim()
	const website = String(formData.get("website") || "").trim()
	const image_url = String(formData.get("image_url") || "").trim()

	if (!name || !description) redirect("/movements/create?error=Nome e descrição são obrigatórios")

	const supabase = await createActionClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) redirect("/auth/login?error=Login necessário")

	const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
	if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/movements?error=Acesso negado")

	const payload: Record<string, any> = {
		name,
		description,
		category: category || null,
		region: region || null,
		founded: founded || null,
		members: members || null,
		contact_whatsapp: whatsapp || null,
		contact_instagram: instagram || null,
		contact_facebook: facebook || null,
		contact_email: email || null,
		website: website || null,
		image_url: image_url || null,
		created_by: user.id,
	}

	const { error } = await supabase.from("movements").insert(payload)

	if (error) redirect(`/movements/create?error=${encodeURIComponent(error.message)}`)
	redirect("/movements?message=Movimento criado")
}

export async function updateMovement(formData: FormData) {
	const id = String(formData.get("id") || "").trim()
	if (!id) redirect("/movements?error=ID inválido")

	const name = String(formData.get("name") || "").trim()
	const description = String(formData.get("description") || "").trim()
	const category = String(formData.get("category") || "").trim()
	const region = String(formData.get("region") || "").trim()
	const founded = String(formData.get("founded") || "").trim()
	const members = Number(formData.get("members") || 0)
	const whatsapp = String(formData.get("whatsapp") || "").trim()
	const instagram = String(formData.get("instagram") || "").trim()
	const facebook = String(formData.get("facebook") || "").trim()
	const email = String(formData.get("email") || "").trim()
	const website = String(formData.get("website") || "").trim()
	const image_url = String(formData.get("image_url") || "").trim()

	if (!name || !description) redirect(`/movements/${id}/edit?error=Nome e descrição são obrigatórios`)

	const supabase = await createActionClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) redirect("/auth/login?error=Login necessário")

	const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
	if (!me || !["admin", "coordinator"].includes(me.role)) redirect(`/movements/${id}?error=Acesso negado`)

	const payload: Record<string, any> = {
		name,
		description,
		category: category || null,
		region: region || null,
		founded: founded || null,
		members: members || null,
		contact_whatsapp: whatsapp || null,
		contact_instagram: instagram || null,
		contact_facebook: facebook || null,
		contact_email: email || null,
		website: website || null,
		image_url: image_url || null,
	}

	const { error } = await supabase.from("movements").update(payload).eq("id", id)
	if (error) redirect(`/movements/${id}/edit?error=${encodeURIComponent(error.message)}`)
	redirect(`/movements/${id}?message=Atualizado`)
}

export async function deleteMovement(formData: FormData) {
	const id = String(formData.get("id") || "").trim()
	if (!id) redirect("/movements?error=ID inválido")

	const supabase = await createActionClient()
	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (!user) redirect("/auth/login?error=Login necessário")

	const { error } = await supabase.from("movements").delete().eq("id", id)
	if (error) redirect(`/movements/${id}?error=${encodeURIComponent(error.message)}`)
	redirect("/movements?message=Excluído")
}

export async function createPartnership(formData: FormData) {
	const name = String(formData.get("name") || "").trim()
	const partnership_type = String(formData.get("partnership_type") || "").trim()
	const members_info = String(formData.get("members_info") || "").trim()
	const order_index = Number(formData.get("order_index") || 0)
	if (!name) redirect("/movements/partnerships?error=Nome é obrigatório")
	const supabase = await createActionClient()
	const { error } = await supabase.from("movement_partnerships").insert({ name, partnership_type, members_info, order_index })
	if (error) redirect(`/movements/partnerships?error=${encodeURIComponent(error.message)}`)
	redirect("/movements/partnerships?message=Criado")
}

export async function updatePartnership(formData: FormData) {
	const id = String(formData.get("id") || "").trim()
	const name = String(formData.get("name") || "").trim()
	const partnership_type = String(formData.get("partnership_type") || "").trim()
	const members_info = String(formData.get("members_info") || "").trim()
	const order_index = Number(formData.get("order_index") || 0)
	if (!id || !name) redirect("/movements/partnerships?error=Dados inválidos")
	const supabase = await createActionClient()
	const { error } = await supabase
		.from("movement_partnerships")
		.update({ name, partnership_type, members_info, order_index })
		.eq("id", id)
	if (error) redirect(`/movements/partnerships?error=${encodeURIComponent(error.message)}`)
	redirect("/movements/partnerships?message=Atualizado")
}

export async function deletePartnership(formData: FormData) {
	const id = String(formData.get("id") || "").trim()
	if (!id) redirect("/movements/partnerships?error=ID inválido")
	const supabase = await createActionClient()
	const { error } = await supabase.from("movement_partnerships").delete().eq("id", id)
	if (error) redirect(`/movements/partnerships?error=${encodeURIComponent(error.message)}`)
	redirect("/movements/partnerships?message=Excluído")
} 