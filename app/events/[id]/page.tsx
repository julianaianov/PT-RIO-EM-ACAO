import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import EventActions from "@/components/event-actions"
import BackButton from "@/components/back-button"

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get event details
  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      profiles!events_created_by_fkey(full_name, email),
      event_participants(
        id,
        confirmed,
        created_at,
        profiles(full_name)
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Check if user is already participating
  let userParticipation = null
  let canEdit = false
  if (user) {
    userParticipation = event.event_participants?.find((p: any) => p.profiles?.id === user.id)
    
    // Check if user can edit (admin or coordinator)
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    canEdit = !!me && ["admin", "coordinator"].includes(me.role)
  }

  const eventTypeLabels = {
    meeting: "Reunião",
    course: "Curso",
    protest: "Ato Público",
    social: "Social",
    campaign: "Campanha",
  }

  const eventTypeColors = {
    meeting: "bg-blue-100 text-blue-800",
    course: "bg-green-100 text-green-800",
    protest: "bg-red-100 text-red-800",
    social: "bg-purple-100 text-purple-800",
    campaign: "bg-red-100 text-red-800",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6"><BackButton /></div>

      {searchParams.message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{searchParams.message}</p>
        </div>
      )}

      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{searchParams.error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <Badge className={eventTypeColors[event.event_type as keyof typeof eventTypeColors]}>
                  {eventTypeLabels[event.event_type as keyof typeof eventTypeLabels]}
                </Badge>
                {event.max_participants && event.current_participants >= event.max_participants && (
                  <Badge variant="destructive">Lotado</Badge>
                )}
              </div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleDateString("pt-BR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="text-lg leading-relaxed">{event.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Local</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{event.location}</span>
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      {event.neighborhood}, {event.city}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Participação</h3>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {event.current_participants} participantes
                      {event.max_participants && ` / ${event.max_participants} vagas`}
                    </span>
                  </div>
                </div>
              </div>

              {event.profiles && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Organização</h3>
                  <p className="text-muted-foreground">Organizado por: {event.profiles.full_name}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {canEdit && (
                  <Button variant="outline" asChild>
                    <Link href={`/events/${event.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Evento
                    </Link>
                  </Button>
                )}
                <EventActions event={event} user={user} userParticipation={userParticipation} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              {event.event_participants && event.event_participants.length > 0 ? (
                <div className="space-y-2">
                  {event.event_participants
                    .filter((p: any) => p.confirmed)
                    .map((participant: any) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-green-700">
                            {participant.profiles?.full_name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="text-sm">{participant.profiles?.full_name || "Participante"}</span>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Confirmado</span>
                      </div>
                    ))}
                  {event.event_participants
                    .filter((p: any) => !p.confirmed)
                    .map((participant: any) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-orange-700">
                            {participant.profiles?.full_name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="text-sm">{participant.profiles?.full_name || "Participante"}</span>
                        <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">Aguardando</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum participante inscrito ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
