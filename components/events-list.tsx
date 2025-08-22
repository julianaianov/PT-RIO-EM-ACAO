"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Share2, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  location: string
  city: string
  neighborhood: string
  event_type: string
  current_participants: number
  max_participants: number | null
  profiles?: { full_name: string }
  event_participants?: { count: number }[]
}

interface EventsListProps {
  events: Event[]
  user: any
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

export default function EventsList({ events, user }: EventsListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const confirmPresence = async (eventId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para confirmar presença no evento",
        variant: "destructive",
      })
      return
    }

    setLoadingStates((prev) => ({ ...prev, [eventId]: true }))

    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: eventId,
        user_id: user.id,
        confirmed: true,
      })

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          toast({
            title: "Já confirmado",
            description: "Você já confirmou presença neste evento",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Presença confirmada!",
          description: "Sua presença foi confirmada no evento",
        })
      }
    } catch (error) {
      console.error("Error confirming presence:", error)
      toast({
        title: "Erro",
        description: "Não foi possível confirmar presença",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [eventId]: false }))
    }
  }

  const shareOnWhatsApp = (event: Event) => {
    const eventDate = new Date(event.event_date).toLocaleDateString("pt-BR")
    const eventTime = new Date(event.event_date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const message = `🔴 *${event.title}*\n\n📅 ${eventDate} às ${eventTime}\n📍 ${event.location}, ${event.neighborhood}\n\n${event.description}\n\n👥 Participe você também! Acesse: ${window.location.origin}/events/${event.id}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const addToGoogleCalendar = (event: Event) => {
    const startDate = new Date(event.event_date)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours duration

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(`${event.location}, ${event.neighborhood}, ${event.city}`)}`

    window.open(googleCalendarUrl, "_blank")
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
          <p className="text-muted-foreground">Não há eventos que correspondam aos filtros selecionados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Badge className={eventTypeColors[event.event_type as keyof typeof eventTypeColors]}>
                  {eventTypeLabels[event.event_type as keyof typeof eventTypeLabels]}
                </Badge>
                {event.max_participants && event.current_participants >= event.max_participants && (
                  <Badge variant="destructive">Lotado</Badge>
                )}
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleDateString("pt-BR")}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-4 w-4" />
                  {new Date(event.event_date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{event.description}</p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">📍</span>
                  <span>
                    {event.neighborhood}, {event.city}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {event.current_participants} participantes
                    {event.max_participants && ` / ${event.max_participants} vagas`}
                  </span>
                </div>
                {event.profiles?.full_name && (
                  <div className="text-sm text-muted-foreground">Organizado por: {event.profiles.full_name}</div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <Link href={`/events/${event.id}`}>Ver Detalhes</Link>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => confirmPresence(event.id)}
                disabled={
                  loadingStates[event.id] ||
                  (!event.max_participants ? false : event.current_participants >= event.max_participants)
                }
              >
                {loadingStates[event.id] ? "Confirmando..." : "Confirmar Presença"}
              </Button>

              <Button size="sm" variant="outline" onClick={() => addToGoogleCalendar(event)}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Google Calendar
              </Button>

              <Button size="sm" variant="outline" onClick={() => shareOnWhatsApp(event)}>
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
