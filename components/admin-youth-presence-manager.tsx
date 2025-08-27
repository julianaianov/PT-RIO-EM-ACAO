"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, User } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface YouthEventAttendee {
  id: string
  event_id: string
  user_id: string
  confirmed: boolean
  created_at: string
}

interface AdminYouthPresenceManagerProps {
  eventId: string
  attendees: YouthEventAttendee[]
  attendeeNames: Map<string, string>
}

export function AdminYouthPresenceManager({ eventId, attendees, attendeeNames }: AdminYouthPresenceManagerProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const confirmPresence = async (attendeeId: string, userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [attendeeId]: true }))

    try {
      // Atualizar o status de confirmação
      const { error: updateError } = await supabase
        .from("youth_event_attendees")
        .update({ confirmed: true })
        .eq("id", attendeeId)

      if (updateError) {
        throw updateError
      }

      toast({
        title: "Presença confirmada!",
        description: "Participante recebeu 5 pontos",
      })

      router.refresh()
    } catch (error) {
      console.error("Erro ao confirmar presença:", error)
      toast({
        title: "Erro",
        description: "Não foi possível confirmar a presença",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [attendeeId]: false }))
    }
  }

  const removePresence = async (attendeeId: string, userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [attendeeId]: true }))

    try {
      // Remover a participação
      const { error: deleteError } = await supabase
        .from("youth_event_attendees")
        .delete()
        .eq("id", attendeeId)

      if (deleteError) {
        throw deleteError
      }

      toast({
        title: "Presença removida!",
        description: "Participante removido do evento",
      })

      router.refresh()
    } catch (error) {
      console.error("Erro ao remover presença:", error)
      toast({
        title: "Erro",
        description: "Não foi possível remover a presença",
        variant: "destructive",
      })
    } finally {
      setLoadingStates((prev) => ({ ...prev, [attendeeId]: false }))
    }
  }

  const confirmedAttendees = attendees.filter(a => a.confirmed)
  const pendingAttendees = attendees.filter(a => !a.confirmed)

  return (
    <div className="space-y-3">
      {/* Participantes Confirmados */}
      {confirmedAttendees.length > 0 && (
        <div>
          <h5 className="font-medium text-green-700 mb-2 flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4" />
            Confirmados ({confirmedAttendees.length})
          </h5>
          <div className="space-y-2">
            {confirmedAttendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-green-600" />
                  <span className="font-medium">
                    {attendeeNames.get(attendee.user_id) || "Participante"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-green-200 text-green-700 text-xs">
                    Confirmado
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removePresence(attendee.id, attendee.user_id)}
                    disabled={loadingStates[attendee.id]}
                    className="h-6 px-2 text-xs"
                  >
                    {loadingStates[attendee.id] ? "..." : "Remover"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Participantes Pendentes */}
      {pendingAttendees.length > 0 && (
        <div>
          <h5 className="font-medium text-orange-700 mb-2 flex items-center gap-2 text-sm">
            <XCircle className="h-4 w-4" />
            Aguardando ({pendingAttendees.length})
          </h5>
          <div className="space-y-2">
            {pendingAttendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-orange-600" />
                  <span className="font-medium">
                    {attendeeNames.get(attendee.user_id) || "Participante"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-orange-200 text-orange-700 text-xs">
                    Pendente
                  </Badge>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 h-6 px-2 text-xs"
                    onClick={() => confirmPresence(attendee.id, attendee.user_id)}
                    disabled={loadingStates[attendee.id]}
                  >
                    {loadingStates[attendee.id] ? "..." : "Confirmar"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sem participantes */}
      {attendees.length === 0 && (
        <div className="text-center py-2 text-gray-500 text-sm">
          Nenhum participante inscrito
        </div>
      )}
    </div>
  )
}

