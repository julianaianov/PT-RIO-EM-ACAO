import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { YouthStats } from "@/components/youth-stats"
import { YouthEvents } from "@/components/youth-events"
import { YouthMentorship } from "@/components/youth-mentorship"
import { Zap, Users, BookOpen, MessageSquare, Calendar, Award } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function YouthPage() {
  const supabase = await createClient()
  const { data: groups } = await supabase
    .from("youth_groups")
    .select("id, name, members, last_activity, topic, color")
    .order("name")
  const { data: leaders } = await supabase
    .from("youth_leaders")
    .select("name, role, age, focus, image_url")
    .order("name")
  const { data: opportunities } = await supabase
    .from("youth_opportunities")
    .select("title, description, org, deadline, opportunity_type")
    .order("deadline", { ascending: true })
  const { data: nextEvent } = await supabase
    .from("youth_events")
    .select("id, title, event_date")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(1)
    .maybeSingle()
  const { data: anyEvent } = nextEvent
    ? { data: null as any }
    : await supabase
        .from("youth_events")
        .select("id, title, event_date")
        .order("event_date", { ascending: true })
        .limit(1)
        .maybeSingle()
  const featuredEvent = nextEvent || anyEvent

  // Determine if user already in featured event
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: attendeeRows } = featuredEvent && user
    ? await supabase.from("youth_event_attendees").select("user_id").eq("event_id", (featuredEvent as any).id).eq("user_id", user.id)
    : { data: [] as any[] }
  const alreadyInFeatured = (attendeeRows || []).length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-purple-50">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Espaço Juventude PT RJ
            </h1>
          </div>
          <p className="text-lg text-white mb-6">O futuro da transformação social está nas mãos da juventude</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
              <Users className="h-4 w-4 mr-2" />
              Participar da Rede
            </Button>
            <Button variant="outline" className="border-red-600 text-red-600 bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Eventos
            </Button>
          </div>
        </div>

        {/* Stats */}
        <YouthStats />

        {/* Quick Actions */}
        <Card className="mb-8 border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
                <BookOpen className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Formação Política</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
                <MessageSquare className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Grupos de Debate</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
                <Award className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Programa Mentoria</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
                <Users className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Rede Jovem</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Featured Content */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Destaque da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=300&width=500"
                    alt="Jovens em ação política"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <Badge className="absolute top-3 left-3 bg-red-600">Formação</Badge>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Workshop: Como Organizar sua Primeira Campanha Política
                </h3>
                <p className="text-gray-600 mb-4">
                  Aprenda as estratégias fundamentais para mobilizar sua comunidade e criar mudanças reais. Workshop
                  prático com lideranças jovens experientes.
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">📅 Sábado, 20/01 • 14h às 18h • Online</div>
                  {featuredEvent ? (
                    !alreadyInFeatured ? (
                      <form action={async () => {
                        "use server"
                        const supa = await createClient()
                        const { data: auth } = await supa.auth.getUser()
                        if (!auth.user) {
                          return redirect(`/auth/login?error=Login necessário&next=/youth/events/${(featuredEvent as any).id}`)
                        }
                        await supa.from("youth_event_attendees").insert({ event_id: (featuredEvent as any).id, user_id: auth.user.id })
                        return redirect(`/youth/events/${(featuredEvent as any).id}?message=Inscrição confirmada`)
                      }}>
                        <Button size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">Inscrever-se</Button>
                      </form>
                    ) : (
                      <Button size="sm" disabled variant="outline" className="border-red-600 text-red-600">Você já está confirmado</Button>
                    )
                  ) : (
                    <Button size="sm" disabled variant="outline" className="border-red-600 text-red-600">Sem evento</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Youth Events */}
            <YouthEvents />

            {/* Discussion Groups */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Grupos de Discussão Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(groups || []).map((group, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color || '#ef4444' }}></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.topic}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {group.members} membros • Última atividade: {group.last_activity}
                          </div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm" className="bg-transparent">
                        <Link href={`/youth/groups/${(group as any).id}`}>Participar</Link>
                      </Button>
                    </div>
                  ))}
                  {(!groups || groups.length === 0) && (
                    <div className="text-sm text-gray-600">Nenhum grupo ativo.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentorship Program */}
            <YouthMentorship />

            {/* Youth Leaders */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Lideranças Jovens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(leaders || []).map((leader, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <img
                        src={leader.image_url || "/placeholder.svg"}
                        alt={leader.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{leader.name}</h4>
                        <p className="text-xs text-orange-600">
                          {leader.role} {leader.age ? `• ${leader.age} anos` : ""}
                        </p>
                        <p className="text-xs text-gray-600">{leader.focus}</p>
                      </div>
                    </div>
                  ))}
                  {(!leaders || leaders.length === 0) && (
                    <div className="text-sm text-gray-600">Nenhuma liderança cadastrada.</div>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent">
                  Ver Todas as Lideranças
                </Button>
              </CardContent>
            </Card>

            {/* Youth Opportunities */}
            <Card className="bg-gradient-to-br from-orange-100 to-red-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-800">Oportunidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(opportunities || []).map((op, index) => (
                    <div key={index} className="p-3 bg-white rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-800">{op.title}</h4>
                      <p className="text-xs text-gray-600">{op.description}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                        {op.opportunity_type}{op.deadline ? ` • até ${new Date(op.deadline).toLocaleDateString('pt-BR')}` : ''}
                    </Badge>
                  </div>
                  ))}
                  {(!opportunities || opportunities.length === 0) && (
                    <div className="text-sm text-gray-600">Nenhuma oportunidade disponível.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
