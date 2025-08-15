import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Eye } from "lucide-react"
import Link from "next/link"

// Mock data - will be replaced with real data from Supabase
const mockBulletins = [
  {
    id: 1,
    title: "Boletim Semanal PT RJ - Semana 3/2024",
    week: "15 a 21 de Janeiro",
    summary: "Resumo das principais atividades, eventos realizados e próximas ações do PT RJ",
    pdf_url: "/placeholder.pdf",
    published_at: "2024-01-21T18:00:00Z",
    downloads: 245,
  },
  {
    id: 2,
    title: "Boletim Semanal PT RJ - Semana 2/2024",
    week: "8 a 14 de Janeiro",
    summary: "Balanço da semana com destaque para reuniões de núcleos e formação política",
    pdf_url: "/placeholder.pdf",
    published_at: "2024-01-14T18:00:00Z",
    downloads: 189,
  },
  {
    id: 3,
    title: "Boletim Semanal PT RJ - Semana 1/2024",
    week: "1 a 7 de Janeiro",
    summary: "Primeiro boletim do ano com planejamento e metas para 2024",
    pdf_url: "/placeholder.pdf",
    published_at: "2024-01-07T18:00:00Z",
    downloads: 312,
  },
]

export default function WeeklyBulletin() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Boletins Semanais</h2>
        <Button variant="outline" asChild>
          <Link href="/news?category=general">Ver Todos</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBulletins.map((bulletin) => (
          <Card key={bulletin.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Boletim Oficial</Badge>
                <div className="text-sm text-muted-foreground">{bulletin.downloads} downloads</div>
              </div>
              <CardTitle className="text-lg leading-tight">{bulletin.title}</CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {bulletin.week}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">{bulletin.summary}</p>

              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/bulletins/${bulletin.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={bulletin.pdf_url} download>
                    <Download className="h-4 w-4 mr-1" />
                    PDF
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
