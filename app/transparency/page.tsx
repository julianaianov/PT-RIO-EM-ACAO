import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TransparencyStats } from "@/components/transparency-stats"
import { FinancialChart } from "@/components/financial-chart"
import { DocumentsList } from "@/components/documents-list"
import { GoalsProgress } from "@/components/goals-progress"
import { FileText, Download, Eye, TrendingUp, DollarSign, Target } from "lucide-react"

export default function TransparencyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Eye className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-blue-800">Transparência PT RJ</h1>
          </div>
          <p className="text-lg text-gray-700 mb-6">
            Prestação de contas e transparência total das atividades do partido
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Relatório Anual 2023
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
              <FileText className="h-4 w-4 mr-2" />
              Documentos Públicos
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <TransparencyStats />

        {/* Quick Access */}
        <Card className="mb-8 border-blue-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle>Acesso Rápido</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-blue-50">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Receitas e Despesas</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-blue-50">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Indicadores</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-blue-50">
                <Target className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Metas e Resultados</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2 bg-transparent hover:bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
                <span className="text-sm">Documentos</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Financial Overview */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Visão Financeira 2024
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FinancialChart />
              </CardContent>
            </Card>

            {/* Goals Progress */}
            <GoalsProgress />

            {/* Recent Activities */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      date: "2024-01-15",
                      activity: "Publicação do Relatório Mensal de Dezembro",
                      type: "Relatório",
                      status: "Concluído",
                    },
                    {
                      date: "2024-01-12",
                      activity: "Prestação de Contas - Campanha Solidária",
                      type: "Prestação",
                      status: "Concluído",
                    },
                    {
                      date: "2024-01-10",
                      activity: "Auditoria Externa - Contas 2023",
                      type: "Auditoria",
                      status: "Em andamento",
                    },
                    {
                      date: "2024-01-08",
                      activity: "Publicação de Gastos com Eventos",
                      type: "Relatório",
                      status: "Concluído",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <h4 className="font-semibold text-gray-800 text-sm">{activity.activity}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <span>{new Date(activity.date).toLocaleDateString("pt-BR")}</span>
                            <Badge variant="secondary" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge
                        className={
                          activity.status === "Concluído"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Documents List */}
            <DocumentsList />

            {/* Compliance Status */}
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Status de Conformidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { item: "Prestação de Contas TSE", status: "Em dia", color: "green" },
                    { item: "Relatórios Mensais", status: "Em dia", color: "green" },
                    { item: "Auditoria Externa", status: "Pendente", color: "yellow" },
                    { item: "Declaração de Bens", status: "Em dia", color: "green" },
                  ].map((compliance, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">{compliance.item}</span>
                      <Badge
                        className={
                          compliance.color === "green" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {compliance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact for Transparency */}
            <Card className="bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Dúvidas sobre Transparência?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Entre em contato com nossa equipe de transparência para esclarecimentos.
                </p>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Email:</strong> transparencia@ptrj.org.br
                  </div>
                  <div>
                    <strong>Telefone:</strong> (21) 3333-4444
                  </div>
                  <div>
                    <strong>Horário:</strong> Seg-Sex, 9h às 17h
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Entrar em Contato</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
