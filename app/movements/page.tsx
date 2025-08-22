import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MovementsFilters } from "@/components/movements-filters"
import { MovementsList } from "@/components/movements-list"
import { Plus, Users, Calendar, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function MovementsPage() {
  const supabase = await createClient()

  // Partnerships
  const { data: partnerships } = await supabase
    .from("movement_partnerships")
    .select("id, name, partnership_type, members_info, order_index")
    .eq("active", true)
    .order("order_index", { ascending: true, nullsFirst: false })

  // Permissions
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let canManage = false
  if (user) {
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    canManage = !!me && ["admin", "coordinator"].includes(me.role)
  }

  // Stats
  const { count: movementsCount } = await supabase
    .from("movements")
    .select("id", { count: "exact", head: true })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startIso = startOfMonth.toISOString()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const endIso = endOfMonth.toISOString()

  const { count: eventsThisMonth } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .gte("event_date", startIso)
    .lt("event_date", endIso)

  const { data: regionsRows } = await supabase
    .from("movements")
    .select("region")
    .not("region", "is", null)
  const regionsActive = new Set((regionsRows || []).map((r: any) => r.region)).size

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Movimentos Sociais</h1>
          <p className="text-red-600 mb-4">Unidos pela transformação social no Rio de Janeiro</p>
          <Link href="/movements/create">
            <Button className="bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Movimento
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{movementsCount ?? 0}</div>
              <div className="text-sm text-gray-600">Movimentos Cadastrados</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{eventsThisMonth ?? 0}</div>
              <div className="text-sm text-gray-600">Eventos Este Mês</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">{regionsActive}</div>
              <div className="text-sm text-gray-600">Regiões Ativas</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Partnerships */}
        <Card className="mb-8 border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white flex items-center justify-between">
            <CardTitle>Parcerias em Destaque</CardTitle>
            {canManage && (
              <Link href="/movements/partnerships">
                <Button variant="ghost" className="bg-transparent border border-white text-white hover:bg-white/10">
                  <Settings className="h-4 w-4 mr-2" /> Gerenciar
                </Button>
              </Link>
            )}
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(partnerships || []).map((p) => (
                <div key={p.id} className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-1">{p.name}</h3>
                  {p.partnership_type && (
                    <Badge variant="secondary" className="mb-2">
                      {p.partnership_type}
                    </Badge>
                  )}
                  {p.members_info && <p className="text-sm text-gray-600">{p.members_info}</p>}
                </div>
              ))}
              {(!partnerships || partnerships.length === 0) && (
                <div className="text-sm text-gray-600">Nenhuma parceria cadastrada.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters and List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MovementsFilters />
          </div>
          <div className="lg:col-span-3">
            <Suspense fallback={<div>Carregando movimentos...</div>}>
              <MovementsList />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
