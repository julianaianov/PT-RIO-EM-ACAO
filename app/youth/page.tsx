import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { YouthStats } from "@/components/youth-stats"
import { YouthEvents } from "@/components/youth-events"
import { YouthMentorship } from "@/components/youth-mentorship"
import { Zap, Users, BookOpen, MessageSquare, Calendar, Award } from "lucide-react"

export default function YouthPage() {
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
          <p className="text-lg text-gray-700 mb-6">O futuro da transformação social está nas mãos da juventude</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
              <Users className="h-4 w-4 mr-2" />
              Participar da Rede
            </Button>
            <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent">
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
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-orange-50">
                <BookOpen className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Formação Política</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-orange-50">
                <MessageSquare className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Grupos de Debate</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-orange-50">
                <Award className="h-6 w-6 text-orange-600" />
                <span className="text-sm">Programa Mentoria</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-orange-50">
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
                  <Badge className="absolute top-3 left-3 bg-orange-600">Formação</Badge>
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
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Inscrever-se
                  </Button>
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
                  {[
                    {
                      name: "Juventude e Meio Ambiente",
                      members: 45,
                      lastActivity: "2h atrás",
                      topic: "Discussão sobre energia renovável",
                      color: "green",
                    },
                    {
                      name: "Feminismo Jovem",
                      members: 67,
                      lastActivity: "5h atrás",
                      topic: "Igualdade salarial para mulheres jovens",
                      color: "purple",
                    },
                    {
                      name: "Tecnologia e Política",
                      members: 32,
                      lastActivity: "1 dia atrás",
                      topic: "Democracia digital e participação",
                      color: "blue",
                    },
                    {
                      name: "Arte e Resistência",
                      members: 28,
                      lastActivity: "2 dias atrás",
                      topic: "Grafite como forma de protesto",
                      color: "red",
                    },
                  ].map((group, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${group.color}-500`}></div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{group.name}</h4>
                          <p className="text-sm text-gray-600">{group.topic}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {group.members} membros • Última atividade: {group.lastActivity}
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Participar
                      </Button>
                    </div>
                  ))}
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
                  {[
                    {
                      name: "Ana Silva",
                      role: "Coordenadora Juventude",
                      age: 24,
                      focus: "Educação Popular",
                      image: "/placeholder.svg?height=60&width=60",
                    },
                    {
                      name: "Carlos Santos",
                      role: "Líder Estudantil",
                      age: 22,
                      focus: "Movimento Estudantil",
                      image: "/placeholder.svg?height=60&width=60",
                    },
                    {
                      name: "Mariana Costa",
                      role: "Ativista Ambiental",
                      age: 26,
                      focus: "Sustentabilidade",
                      image: "/placeholder.svg?height=60&width=60",
                    },
                  ].map((leader, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <img
                        src={leader.image || "/placeholder.svg"}
                        alt={leader.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">{leader.name}</h4>
                        <p className="text-xs text-orange-600">
                          {leader.role} • {leader.age} anos
                        </p>
                        <p className="text-xs text-gray-600">{leader.focus}</p>
                      </div>
                    </div>
                  ))}
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
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-sm text-gray-800">Estágio Político</h4>
                    <p className="text-xs text-gray-600">Gabinete Deputado Estadual</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Inscrições abertas
                    </Badge>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-sm text-gray-800">Bolsa Formação</h4>
                    <p className="text-xs text-gray-600">Curso de Gestão Pública</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Até 25/01
                    </Badge>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <h4 className="font-semibold text-sm text-gray-800">Intercâmbio</h4>
                    <p className="text-xs text-gray-600">Foro de São Paulo - Chile</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Seleção aberta
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
