import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Target, CheckCircle2 } from "lucide-react"
import { ShowToast } from "@/components/show-toast"

export default async function YouthMentorshipDetailPage({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
	const supabase = await createClient()

	const { data: program } = await supabase
		.from("youth_mentorships")
		.select("id, title, description, duration, mentors, mentees, next_cohort, level")
		.eq("id", params.id)
		.single()
	if (!program) redirect("/youth?error=Mentoria não encontrada")

	// Fetch applications (no joins to avoid relationship requirement)
	const { data: applications } = await supabase
		.from("youth_mentorship_applications")
		.select("user_id")
		.eq("program_id", params.id)

	// Load names from profiles using the user ids
	const applicantIds = (applications || []).map((a: any) => a.user_id)
	const { data: profiles } = applicantIds.length
		? await supabase.from("profiles").select("id, full_name").in("id", applicantIds)
		: { data: [] as any[] }
	const idToName = new Map<string, string>((profiles || []).map((p: any) => [p.id, p.full_name]))

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const alreadyApplied = user ? (applications || []).some((a: any) => a.user_id === user.id) : false
	const message = typeof searchParams?.message === "string" ? (searchParams?.message as string) : undefined

	const getLevelColor = (level: string) => {
		const colors: Record<string, string> = {
			Iniciante: "bg-green-100 text-green-800",
			Intermediário: "bg-yellow-100 text-yellow-800",
			Avançado: "bg-red-100 text-red-800",
		}
		return colors[level] || "bg-gray-100 text-gray-800"
	}

	return (
		<div className="container mx-auto px-4 py-6">
			<ShowToast message={message} />
			<div className="mb-4 text-white"><BackButton fallback="/youth" /></div>
			<Card className="border-red-200 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
					<div className="flex items-center justify-between">
						<CardTitle className="text-xl flex items-center gap-2">
							{program.title}
							<Badge className={getLevelColor(program.level)}>{program.level}</Badge>
						</CardTitle>
						{alreadyApplied && (
							<span className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full"><CheckCircle2 className="h-4 w-4" /> Candidatado</span>
						)}
					</div>
				</CardHeader>
				<CardContent className="space-y-4 p-4 bg-white/60">
					<div className="grid md:grid-cols-2 gap-4">
						<div className="space-y-2 text-sm text-gray-700">
							<div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> {program.duration}</div>
							<div className="flex items-center gap-2"><Users className="h-4 w-4" /> {program.mentors} mentores</div>
							<div className="flex items-center gap-2"><Target className="h-4 w-4" /> {program.mentees} vagas</div>
							<div className="text-red-600 font-medium">Início: {program.next_cohort}</div>
						</div>
						<div>
							<div className="text-sm font-semibold mb-1">Descrição</div>
							<div className="text-sm text-gray-800 whitespace-pre-wrap">{program.description}</div>
						</div>
					</div>

					<div className="flex flex-col gap-2">
						{!alreadyApplied ? (
							<form action={async (formData: FormData) => {
								"use server"
								const supa = await createClient()
								const { data: auth } = await supa.auth.getUser()
								if (!auth.user) redirect(`/auth/login?error=Login necessário&next=/youth/mentorships/${params.id}`)
								const motivation = String(formData.get("motivation") || "").trim() || null
								const insert = { program_id: params.id, user_id: auth.user.id, motivation }
								const { error } = await supa.from("youth_mentorship_applications").insert(insert)
								if (error && !String(error.message).includes("duplicate")) {
									redirect(`/youth/mentorships/${params.id}?message=${encodeURIComponent("Erro ao enviar candidatura")}`)
								}
								redirect(`/youth/mentorships/${params.id}?message=${encodeURIComponent("Candidatura enviada")}`)
							}}>
								<textarea name="motivation" placeholder="Sua motivação (opcional)" className="w-full h-20 text-sm px-3 py-2 rounded border border-red-300 bg-white/90 focus:outline-none focus:ring-2 focus:ring-red-600"></textarea>
								<div className="flex justify-end mt-2">
									<Button className="bg-red-600 hover:bg-red-700">Candidatar-se</Button>
								</div>
							</form>
						) : (
							<Button disabled variant="outline" className="border-red-600 text-red-600">Você já se candidatou</Button>
						)}
					</div>

					<div>
						<div className="text-sm font-semibold mb-2">Candidaturas</div>
						<div className="flex flex-wrap gap-2">
							{(applications || []).map((a: any) => (
								<div key={a.user_id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
									{ idToName.get(a.user_id) || "Participante" }
								</div>
							))}
							{(!applications || applications.length === 0) && (
								<div className="text-xs text-gray-600">Seja o primeiro a se candidatar.</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
} 