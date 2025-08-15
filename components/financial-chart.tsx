"use client"

import { Card } from "@/components/ui/card"

export function FinancialChart() {
  const monthlyData = [
    { month: "Jan", receitas: 180000, despesas: 165000 },
    { month: "Fev", receitas: 220000, despesas: 185000 },
    { month: "Mar", receitas: 195000, despesas: 175000 },
    { month: "Abr", receitas: 240000, despesas: 200000 },
    { month: "Mai", receitas: 210000, despesas: 190000 },
    { month: "Jun", receitas: 260000, despesas: 220000 },
  ]

  const expenseCategories = [
    { category: "Pessoal", amount: 850000, percentage: 40.5, color: "bg-blue-500" },
    { category: "Eventos", amount: 420000, percentage: 20.0, color: "bg-green-500" },
    { category: "Comunicação", amount: 315000, percentage: 15.0, color: "bg-purple-500" },
    { category: "Infraestrutura", amount: 210000, percentage: 10.0, color: "bg-orange-500" },
    { category: "Formação", amount: 168000, percentage: 8.0, color: "bg-red-500" },
    { category: "Outros", amount: 137000, percentage: 6.5, color: "bg-gray-500" },
  ]

  const maxValue = Math.max(...monthlyData.map((d) => Math.max(d.receitas, d.despesas)))

  return (
    <div className="space-y-6">
      {/* Monthly Chart */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Receitas vs Despesas (2024)</h3>
        <div className="space-y-3">
          {monthlyData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{data.month}</span>
                <div className="flex gap-4">
                  <span className="text-green-600">R$ {(data.receitas / 1000).toFixed(0)}k</span>
                  <span className="text-red-600">R$ {(data.despesas / 1000).toFixed(0)}k</span>
                </div>
              </div>
              <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 opacity-70"
                  style={{ width: `${(data.receitas / maxValue) * 100}%` }}
                ></div>
                <div
                  className="absolute top-0 left-0 h-full bg-red-500 opacity-70"
                  style={{ width: `${(data.despesas / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Despesas</span>
          </div>
        </div>
      </div>

      {/* Expense Categories */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
        <div className="space-y-3">
          {expenseCategories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-4 h-4 rounded ${category.color}`}></div>
                <span className="text-sm font-medium">{category.category}</span>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${category.color}`}
                      style={{ width: `${category.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">R$ {(category.amount / 1000).toFixed(0)}k</div>
                <div className="text-xs text-gray-500">{category.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-blue-50 border-blue-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">R$ 1.3M</div>
            <div className="text-sm text-gray-600">Total Receitas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">R$ 1.1M</div>
            <div className="text-sm text-gray-600">Total Despesas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">R$ 200K</div>
            <div className="text-sm text-gray-600">Saldo Positivo</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
