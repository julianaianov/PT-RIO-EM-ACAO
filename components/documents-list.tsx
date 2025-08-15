import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Calendar } from "lucide-react"

const documents = [
  {
    title: "Relatório Anual 2023",
    type: "Relatório",
    date: "2024-01-15",
    size: "2.4 MB",
    downloads: 1247,
    category: "Financeiro",
  },
  {
    title: "Prestação de Contas TSE",
    type: "Prestação",
    date: "2024-01-10",
    size: "1.8 MB",
    downloads: 892,
    category: "Legal",
  },
  {
    title: "Balanço Patrimonial 2023",
    type: "Balanço",
    date: "2024-01-08",
    size: "1.2 MB",
    downloads: 654,
    category: "Financeiro",
  },
  {
    title: "Relatório de Atividades Q4",
    type: "Relatório",
    date: "2024-01-05",
    size: "3.1 MB",
    downloads: 423,
    category: "Atividades",
  },
  {
    title: "Auditoria Externa 2023",
    type: "Auditoria",
    date: "2023-12-20",
    size: "4.2 MB",
    downloads: 789,
    category: "Legal",
  },
]

export function DocumentsList() {
  const getCategoryColor = (category: string) => {
    const colors = {
      Financeiro: "bg-green-100 text-green-800",
      Legal: "bg-blue-100 text-blue-800",
      Atividades: "bg-purple-100 text-purple-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Documentos Públicos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc, index) => (
            <div key={index} className="p-3 border border-blue-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm mb-1">{doc.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {doc.type}
                    </Badge>
                    <Badge className={`text-xs ${getCategoryColor(doc.category)}`}>{doc.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(doc.date).toLocaleDateString("pt-BR")}
                  </div>
                  <span>{doc.size}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="h-3 w-3" />
                  {doc.downloads}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="h-3 w-3 mr-1" />
                  Visualizar
                </Button>
                <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50">
          Ver Todos os Documentos
        </Button>
      </CardContent>
    </Card>
  )
}
