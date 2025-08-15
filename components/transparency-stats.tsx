import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, FileText, TrendingUp, Eye, CheckCircle } from "lucide-react"

export function TransparencyStats() {
  const stats = [
    {
      icon: DollarSign,
      value: "R$ 2.4M",
      label: "Receitas 2024",
      change: "+8.5%",
      color: "text-green-600",
    },
    {
      icon: DollarSign,
      value: "R$ 2.1M",
      label: "Despesas 2024",
      change: "+5.2%",
      color: "text-red-600",
    },
    {
      icon: FileText,
      value: "156",
      label: "Documentos Públicos",
      change: "+12",
      color: "text-blue-600",
    },
    {
      icon: Eye,
      value: "8.7K",
      label: "Visualizações",
      change: "+23%",
      color: "text-purple-600",
    },
    {
      icon: CheckCircle,
      value: "100%",
      label: "Conformidade",
      change: "Mantido",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      value: "95%",
      label: "Transparência",
      change: "+2%",
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <Card key={index} className="border-blue-200 hover:shadow-md transition-shadow">
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
