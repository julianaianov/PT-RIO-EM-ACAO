import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShowToast } from "@/components/show-toast"

export default async function ApplyMentorPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
	const supabase = await createClient()
	const message = typeof searchParams?.message === "string" ? (searchParams?.message as string) : undefined

	return (
		<div className="container mx-auto px-4 py-6">
			<ShowToast message={message} />
			<div className="mb-4 text-white"><BackButton fallback="/youth" /></div>
			<Card className="border-red-200 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
					<CardTitle className="text-xl">Inscrição para Mentores</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 p-4 bg-white/60">
					<form action={async (formData: FormData) => {
						"use server"
						const supa = await createClient()
						const { data: auth } = await supa.auth.getUser()
						if (!auth.user) redirect(`/auth/login?error=Login necessário&next=/youth/mentorships/mentor`)
						const areas = String(formData.get("areas") || "").trim() || null
						const message = String(formData.get("message") || "").trim() || null
						const insert = { user_id: auth.user.id, areas, message }
						const { error } = await supa.from("youth_mentor_applications").insert(insert)
						if (error && !String(error.message).includes("duplicate")) {
							redirect(`/youth/mentorships/mentor?message=${encodeURIComponent("Erro ao enviar inscrição")}`)
						}
						redirect(`/youth/mentorships/mentor?message=${encodeURIComponent("Inscrição enviada")}`)
					}}>
						<div className="space-y-2">
							<label className="text-sm text-gray-700">Áreas de atuação (ex.: comunicação, mobilização)</label>
							<input name="areas" className="w-full h-10 text-sm px-3 py-2 rounded border border-red-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-red-600" />
							<label className="text-sm text-gray-700">Mensagem (opcional)</label>
							<textarea name="message" className="w-full h-24 text-sm px-3 py-2 rounded border border-red-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-red-600" />
						</div>
						<div className="flex justify-end mt-2">
							<Button className="bg-red-600 hover:bg-red-700">Enviar</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
} 