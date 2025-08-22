import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import EventActions from "@/components/event-actions"
import BackButton from "@/components/back-button"

export default async function EventDetailPage({
  params,
}: {
  params: { id: string }
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
  if (user) {
    userParticipation = event.event_participants?.find((p: any) => p.profiles?.id === user.id)
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

              <EventActions event={event} user={user} userParticipation={userParticipation} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Participantes Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              {event.event_participants && event.event_participants.length > 0 ? (
                <div className="space-y-2">
                  {event.event_participants
                    .filter((p: any) => p.confirmed)
                    .map((participant: any) => (
                      <div key={participant.id} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {participant.profiles?.full_name?.charAt(0) || "?"}
                          </span>
                        </div>
                        <span className="text-sm">{participant.profiles?.full_name || "Participante"}</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Nenhum participante confirmado ainda.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
