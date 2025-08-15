import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Users, Calendar } from "lucide-react"

const goals = [
  {
    title: "Transparência Total",
    description: "Publicar 100% dos documentos obrigatórios",
    target: 100,
    current: 95,
    unit: "%",
    deadline: "2024-12-31",
    status: "Em andamento",
    category: "Governança",
  },
  {
    title: "Engajamento Digital",
    description: "Alcançar 10.000 visualizações mensais",
    target: 10000,
    current: 8700,
    unit: "views",
    deadline: "2024-06-30",
    status: "Em andamento",
    category: "Comunicação",
  },
  {
    title: "Formação Política",
    description: "Formar 500 novos militantes",
    target: 500,
    current: 347,
    unit: "pessoas",
    deadline: "2024-12-31",
    status: "Em andamento",
    category: "Educação",
  },
  {
    title: "Núcleos Ativos",
    description: "Ativar 50 núcleos no estado",
    target: 50,
    current: 47,
    unit: "núcleos",
    deadline: "2024-08-31",
    status: "Quase concluído",
    category: "Organização",
  },
]

export function GoalsProgress() {
  const getStatusColor = (status: string) => {
    const colors = {
      "Em andamento": "bg-blue-100 text-blue-800",
      "Quase concluído": "bg-green-100 text-green-800",
      Concluído: "bg-green-100 text-green-800",
      Atrasado: "bg-red-100 text-red-800",
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      Governança: "bg-purple-100 text-purple-800",
      Comunicação: "bg-orange-100 text-orange-800",
      Educação: "bg-green-100 text-green-800",
      Organização: "bg-blue-100 text-blue-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <Target className="h-5 w-5" />
          Metas e Indicadores 2024
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{goal.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(goal.category)}>{goal.category}</Badge>
                    <Badge className={getStatusColor(goal.status)}>{goal.status}</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso</span>
                  <span className="font-semibold">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(goal.current / goal.target) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Prazo: {new Date(goal.deadline).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {Math.round((goal.current / goal.target) * 100)}% concluído
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">Resumo Geral</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">4</div>
              <div className="text-xs text-gray-600">Metas Ativas</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">1</div>
              <div className="text-xs text-gray-600">Quase Concluída</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">3</div>
              <div className="text-xs text-gray-600">Em Andamento</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">82%</div>
              <div className="text-xs text-gray-600">Progresso Médio</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
