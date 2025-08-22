import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cookies } from "next/headers"
import { ShowToast } from "@/components/show-toast"

export default async function YouthEventDetailPage({ params, searchParams }: { params: { id: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("youth_events")
    .select("id, title, description, event_date, location, category, participants, max_participants, event_type, organizer")
    .eq("id", params.id)
    .single()
  if (!event) redirect("/youth?error=Evento não encontrado")

  const { data: attendeeRows } = await supabase
    .from("youth_event_attendees")
    .select("user_id")
    .eq("event_id", params.id)

  const attendeeIds = (attendeeRows || []).map((a: any) => a.user_id)
  const { data: profiles } = attendeeIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", attendeeIds)
    : { data: [] as any[] }
  const idToName = new Map<string, string>((profiles || []).map((p: any) => [p.id, p.full_name]))

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const alreadyIn = user ? (attendeeRows || []).some((a: any) => a.user_id === user.id) : false

  const message = typeof searchParams?.message === 'string' ? searchParams?.message : undefined

  return (
    <div className="container mx-auto px-4 py-6">
      <ShowToast message={message} />
      <div className="mb-4 text-white"><BackButton fallback="/youth" /></div>
      <Card className="border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{event.title}</CardTitle>
            {alreadyIn && (
              <span className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full"><CheckCircle2 className="h-4 w-4" /> Confirmado</span>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 bg-white/60">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {new Date(event.event_date).toLocaleString("pt-BR")}</div>
              <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> {new Date(event.event_date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {event.location}</div>
              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> {event.participants}/{event.max_participants} participantes</div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-1">Descrição</div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap">{event.description}</div>
            </div>
          </div>

          <div className="flex justify-end">
            {!alreadyIn ? (
              <form action={async () => {
                "use server"
                const supa = await createClient()
                const { data: auth } = await supa.auth.getUser()
                if (!auth.user) redirect(`/auth/login?error=Login necessário&next=/youth/events/${params.id}`)
                await supa.from("youth_event_attendees").insert({ event_id: params.id, user_id: auth.user.id })
                redirect(`/youth/events/${params.id}?message=Inscrição confirmada`)
              }}>
                <Button className="bg-red-600 hover:bg-red-700">Participar</Button>
              </form>
            ) : (
              <Button disabled variant="outline" className="border-red-600 text-red-600">Você já está confirmado</Button>
            )}
          </div>

          <div>
            <div className="text-sm font-semibold mb-2">Quem vai participar</div>
            <div className="flex flex-wrap gap-2">
              {(attendeeRows || []).map((a: any) => (
                <div key={a.user_id} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  { idToName.get(a.user_id) || "Participante" }
                </div>
              ))}
              {(!attendeeRows || attendeeRows.length === 0) && (
                <div className="text-xs text-gray-600">Seja o primeiro a confirmar presença.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 