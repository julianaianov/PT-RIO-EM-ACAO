import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, CheckCircle, XCircle } from "lucide-react"
import BackButton from "@/components/back-button"
import { AdminEventPresenceManager } from "@/components/admin-event-presence-manager"

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()

  // auth + guard
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Você precisa estar logado")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") redirect("/?error=Acesso restrito ao admin")

  // Buscar eventos com participantes
  const { data: events } = await supabase
    .from("events")
    .select(`
      *,
      profiles!events_created_by_fkey(full_name),
      event_participants(
        id,
        confirmed,
        created_at,
        profiles(full_name, email, points)
      )
    `)
    .order("event_date", { ascending: false })

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
      <div className="mb-6 text-white"><BackButton fallback="/admin" /></div>
      
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

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-800">Gerenciar Presenças em Eventos</CardTitle>
          <p className="text-gray-600">Confirme as presenças dos participantes para que eles recebam os pontos</p>
        </CardHeader>
        <CardContent>
          <AdminEventPresenceManager events={events || []} eventTypeLabels={eventTypeLabels} eventTypeColors={eventTypeColors} />
        </CardContent>
      </Card>
    </div>
  )
}

