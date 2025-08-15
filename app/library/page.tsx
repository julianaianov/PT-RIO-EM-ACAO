import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileText, BookOpen } from "lucide-react"
import Link from "next/link"

// Mock data for digital library
const libraryMaterials = [
  {
    id: 1,
    title: "Cartilha: História do Partido dos Trabalhadores",
    description: "Material completo sobre a fundação e trajetória do PT no Brasil",
    category: "history",
    type: "pdf",
    pages: 45,
    downloads: 1250,
    url: "/placeholder.pdf",
  },
  {
    id: 2,
    title: "Manual de Organização Sindical",
    description: "Guia prático para organização e mobilização sindical",
    category: "social",
    type: "pdf",
    pages: 32,
    downloads: 890,
    url: "/placeholder.pdf",
  },
  {
    id: 3,
    title: "Economia Popular e Solidária",
    description: "Princípios e práticas da economia solidária",
    category: "economics",
    type: "pdf",
    pages: 28,
    downloads: 567,
    url: "/placeholder.pdf",
  },
  {
    id: 4,
    title: "Cartilha de Formação Política",
    description: "Conceitos básicos de política e cidadania",
    category: "politics",
    type: "pdf",
    pages: 38,
    downloads: 1456,
    url: "/placeholder.pdf",
  },
  {
    id: 5,
    title: "Guia de Campanhas Eleitorais",
    description: "Estratégias e táticas para campanhas políticas",
    category: "campaign",
    type: "pdf",
    pages: 52,
    downloads: 723,
    url: "/placeholder.pdf",
  },
  {
    id: 6,
    title: "Movimentos Sociais no Brasil",
    description: "História e importância dos movimentos sociais brasileiros",
    category: "social",
    type: "pdf",
    pages: 41,
    downloads: 634,
    url: "/placeholder.pdf",
  },
]

const categoryLabels = {
  history: "História",
  politics: "Política",
  economics: "Economia",
  social: "Social",
  campaign: "Campanha",
}

const categoryColors = {
  history: "bg-amber-100 text-amber-800",
  politics: "bg-blue-100 text-blue-800",
  economics: "bg-green-100 text-green-800",
  social: "bg-purple-100 text-purple-800",
  campaign: "bg-red-100 text-red-800",
}

export default function LibraryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Biblioteca Digital</h1>
        <p className="text-muted-foreground">Acesse cartilhas, manuais e materiais de formação política</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {libraryMaterials.map((material) => (
          <Card key={material.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={categoryColors[material.category as keyof typeof categoryColors]}>
                  {categoryLabels[material.category as keyof typeof categoryLabels]}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {material.pages} páginas
                </div>
              </div>
              <CardTitle className="text-lg leading-tight">{material.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">{material.description}</p>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{material.downloads} downloads</span>
                <span>PDF</span>
              </div>

              <div className="flex gap-2">
                <Button size="sm" asChild>
                  <Link href={`/library/${material.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Visualizar
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                  <a href={material.url} download>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Como usar a Biblioteca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Explore</h3>
                <p className="text-sm text-muted-foreground">
                  Navegue pelos materiais organizados por categoria e tema
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Estude</h3>
                <p className="text-sm text-muted-foreground">
                  Leia online ou faça download dos PDFs para estudar offline
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Compartilhe</h3>
                <p className="text-sm text-muted-foreground">
                  Compartilhe o conhecimento com outros militantes e simpatizantes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
