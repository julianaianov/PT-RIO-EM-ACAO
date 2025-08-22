import { Card, CardContent } from "@/components/ui/card"
import { Users, Calendar, BookOpen, Award, TrendingUp, MessageSquare } from "lucide-react"

export function YouthStats() {
  const stats = [
    {
      icon: Users,
      value: "1,247",
      label: "Membros Ativos",
      change: "+12%",
      color: "text-red-600",
    },
    {
      icon: Calendar,
      value: "34",
      label: "Eventos Este Mês",
      change: "+8%",
      color: "text-red-600",
    },
    {
      icon: BookOpen,
      value: "89",
      label: "Cursos Concluídos",
      change: "+23%",
      color: "text-purple-600",
    },
    {
      icon: MessageSquare,
      value: "15",
      label: "Grupos Ativos",
      change: "+5%",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "67",
      label: "Lideranças Formadas",
      change: "+15%",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      value: "92%",
      label: "Engajamento",
      change: "+3%",
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="border-orange-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <IconComponent className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
              <div className="text-xs text-green-600 font-medium">{stat.change}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
