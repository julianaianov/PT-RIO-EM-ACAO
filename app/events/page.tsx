import { createClient } from "@/lib/supabase/server"
import EventsList from "@/components/events-list"
import EventFilters from "@/components/event-filters"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  city?: string
  neighborhood?: string
  type?: string
  date?: string
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Get user to check permissions
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    userProfile = profile
  }

  // Build query with filters
  let query = supabase
    .from("events")
    .select(`
      *,
      event_participants(count),
      profiles!events_created_by_fkey(full_name)
    `)
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })

  if (searchParams.city) {
    query = query.eq("city", searchParams.city)
  }
  if (searchParams.neighborhood) {
    query = query.eq("neighborhood", searchParams.neighborhood)
  }
  if (searchParams.type) {
    query = query.eq("event_type", searchParams.type)
  }

  const { data: events, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Agenda de Eventos</h1>
          <p className="text-muted-foreground">Participe dos eventos do PT RJ e ajude a construir a mudança</p>
        </div>

        {userProfile?.role === "coordinator" || userProfile?.role === "admin" ? (
          <Button asChild className="bg-red-600 hover:bg-red-700">
            <Link href="/events/create">Novo Evento</Link>
          </Button>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <EventFilters />
        </div>
        <div className="lg:col-span-3">
          <EventsList events={events || []} user={user} />
        </div>
      </div>
    </div>
  )
}
