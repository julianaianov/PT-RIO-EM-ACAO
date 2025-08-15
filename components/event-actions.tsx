"use client"

import { Button } from "@/components/ui/button"
import { Share2, ExternalLink, UserCheck, UserX } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface EventActionsProps {
  event: any
  user: any
  userParticipation: any
}

export default function EventActions({ event, user, userParticipation }: EventActionsProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const confirmPresence = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para confirmar presença no evento",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.from("event_participants").insert({
        event_id: event.id,
        user_id: user.id,
        confirmed: true,
      })

      if (error) {
        if (error.code === "23505") {
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
        router.refresh()
      }
    } catch (error) {
      console.error("Error confirming presence:", error)
      toast({
        title: "Erro",
        description: "Não foi possível confirmar presença",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const cancelPresence = async () => {
    if (!userParticipation) return

    setLoading(true)

    try {
      const { error } = await supabase.from("event_participants").delete().eq("id", userParticipation.id)

      if (error) {
        throw error
      }

      toast({
        title: "Presença cancelada",
        description: "Sua presença foi cancelada do evento",
      })
      router.refresh()
    } catch (error) {
      console.error("Error canceling presence:", error)
      toast({
        title: "Erro",
        description: "Não foi possível cancelar presença",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const shareOnWhatsApp = () => {
    const eventDate = new Date(event.event_date).toLocaleDateString("pt-BR")
    const eventTime = new Date(event.event_date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })

    const message = `🔴 *${event.title}*\n\n📅 ${eventDate} às ${eventTime}\n📍 ${event.location}, ${event.neighborhood}\n\n${event.description}\n\n👥 Participe você também! Acesse: ${window.location.href}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const addToGoogleCalendar = () => {
    const startDate = new Date(event.event_date)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // 2 hours duration

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z/${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(`${event.location}, ${event.neighborhood}, ${event.city}`)}`

    window.open(googleCalendarUrl, "_blank")
  }

  const isEventFull = event.max_participants && event.current_participants >= event.max_participants

  return (
    <div className="flex flex-wrap gap-3">
      {userParticipation ? (
        <Button variant="outline" onClick={cancelPresence} disabled={loading}>
          <UserX className="h-4 w-4 mr-2" />
          {loading ? "Cancelando..." : "Cancelar Presença"}
        </Button>
      ) : (
        <Button onClick={confirmPresence} disabled={loading || isEventFull}>
          <UserCheck className="h-4 w-4 mr-2" />
          {loading ? "Confirmando..." : isEventFull ? "Evento Lotado" : "Confirmar Presença"}
        </Button>
      )}

      <Button variant="outline" onClick={addToGoogleCalendar}>
        <ExternalLink className="h-4 w-4 mr-2" />
        Google Calendar
      </Button>

      <Button variant="outline" onClick={shareOnWhatsApp}>
        <Share2 className="h-4 w-4 mr-2" />
        Compartilhar no WhatsApp
      </Button>
    </div>
  )
}
