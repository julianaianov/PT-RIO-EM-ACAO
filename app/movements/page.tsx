import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MovementsFilters } from "@/components/movements-filters"
import { MovementsList } from "@/components/movements-list"
import { Plus, Users, Calendar, MapPin } from "lucide-react"

export default function MovementsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Movimentos Sociais</h1>
          <p className="text-red-600 mb-4">Unidos pela transformação social no Rio de Janeiro</p>
          <Button className="bg-red-600 hover:bg-red-700">
            <Plus className="h-4 w-4 mr-2" />
            Cadastrar Movimento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">47</div>
              <div className="text-sm text-gray-600">Movimentos Cadastrados</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">23</div>
              <div className="text-sm text-gray-600">Eventos Este Mês</div>
            </CardContent>
          </Card>
          <Card className="border-red-200">
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-800">15</div>
              <div className="text-sm text-gray-600">Regiões Ativas</div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Partnerships */}
        <Card className="mb-8 border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardTitle>Parcerias em Destaque</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Frente Brasil Popular", type: "Articulação Nacional", members: "120+ organizações" },
                { name: "Levante Popular da Juventude", type: "Movimento Juvenil", members: "5.000+ jovens" },
                { name: "MST Rio de Janeiro", type: "Movimento Rural", members: "2.000+ famílias" },
              ].map((partnership, index) => (
                <div key={index} className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-800 mb-1">{partnership.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {partnership.type}
                  </Badge>
                  <p className="text-sm text-gray-600">{partnership.members}</p>
                </div>
              ))}
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
