"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle, User } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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
  event_participants?: Array<{
    id: string
    confirmed: boolean
    created_at: string
    profiles: {
      id: string
      full_name: string
      email: string
      points: number
    }
  }>
}

interface AdminEventPresenceManagerProps {
  events: Event[]
  eventTypeLabels: Record<string, string>
  eventTypeColors: Record<string, string>
}

export function AdminEventPresenceManager({ events, eventTypeLabels, eventTypeColors }: AdminEventPresenceManagerProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const router = useRouter()

  const confirmPresence = async (participantId: string, userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [participantId]: true }))

    try {
      // Verificar se já está confirmado
      const { data: participant } = await supabase
        .from("event_participants")
        .select("confirmed")
        .eq("id", participantId)
        .single()

      if (participant?.confirmed) {
        toast({
          title: "Já confirmado",
          description: "Este participante já foi confirmado",
          variant: "destructive",
        })
        return
      }

      // Atualizar o status de confirmação
      const { error: updateError } = await supabase
        .from("event_participants")
        .update({ confirmed: true })
        .eq("id", participantId)

      if (updateError) {
        throw updateError
      }

      // Adicionar pontos ao usuário (5 pontos por presença confirmada)
      const { error: pointsError } = await supabase.rpc("add_points", {
        p_user_id: userId,
        p_delta: 5,
        p_reason: "Presença confirmada em evento"
      })

      if (pointsError) {
        console.warn("Erro ao adicionar pontos:", pointsError)
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
      setLoadingStates((prev) => ({ ...prev, [participantId]: false }))
    }
  }

  const removePresence = async (participantId: string, userId: string) => {
    setLoadingStates((prev) => ({ ...prev, [participantId]: true }))

    try {
      // Remover a participação
      const { error: deleteError } = await supabase
        .from("event_participants")
        .delete()
        .eq("id", participantId)

      if (deleteError) {
        throw deleteError
      }

      // Remover pontos do usuário (se estava confirmado)
      const { error: pointsError } = await supabase.rpc("add_points", {
        p_user_id: userId,
        p_delta: -5,
        p_reason: "Presença removida de evento"
      })

      if (pointsError) {
        console.warn("Erro ao remover pontos:", pointsError)
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
      setLoadingStates((prev) => ({ ...prev, [participantId]: false }))
    }
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum evento encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {events.map((event) => {
        const participants = event.event_participants || []
        const confirmedParticipants = participants.filter(p => p.confirmed)
        const pendingParticipants = participants.filter(p => !p.confirmed)

        return (
          <Card key={event.id} className="border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={eventTypeColors[event.event_type] || "bg-gray-100 text-gray-800"}>
                    {eventTypeLabels[event.event_type] || event.event_type}
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
              {event.location && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Participantes Confirmados */}
                {confirmedParticipants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Participantes Confirmados ({confirmedParticipants.length})
                    </h4>
                    <div className="space-y-2">
                      {confirmedParticipants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {participant.profiles.full_name || "Participante"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {participant.profiles.email} • {participant.profiles.points} pontos
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-green-200 text-green-700">
                              Confirmado
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removePresence(participant.id, participant.profiles.id)}
                              disabled={loadingStates[participant.id]}
                            >
                              {loadingStates[participant.id] ? "Removendo..." : "Remover"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Participantes Pendentes */}
                {pendingParticipants.length > 0 && (
                  <div>
                    <h4 className="font-medium text-orange-700 mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Aguardando Confirmação ({pendingParticipants.length})
                    </h4>
                    <div className="space-y-2">
                      {pendingParticipants.map((participant) => (
                        <div key={participant.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {participant.profiles.full_name || "Participante"}
                              </div>
                              <div className="text-sm text-gray-500">
                                {participant.profiles.email} • {participant.profiles.points} pontos
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="border-orange-200 text-orange-700">
                              Pendente
                            </Badge>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => confirmPresence(participant.id, participant.profiles.id)}
                              disabled={loadingStates[participant.id]}
                            >
                              {loadingStates[participant.id] ? "Confirmando..." : "Confirmar Presença"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sem participantes */}
                {participants.length === 0 && (
                  <div className="text-center py-6 text-gray-500">
                    Nenhum participante inscrito neste evento
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
