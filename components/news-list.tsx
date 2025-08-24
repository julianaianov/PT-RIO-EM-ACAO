import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Play, Volume2, ImageIcon } from "lucide-react"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  image_url: string | null
  video_url: string | null
  audio_url: string | null
  category: string
  priority: number
  target_region: string | null
  published_at: string
  profiles?: { full_name: string }
}

interface NewsListProps {
  news: NewsItem[]
}

const categoryLabels = {
  politics: "Política",
  campaign: "Campanha",
  social: "Social",
  formation: "Formação",
  general: "Geral",
}

const categoryColors = {
  politics: "bg-blue-100 text-blue-800",
  campaign: "bg-red-100 text-red-800",
  social: "bg-green-100 text-green-800",
  formation: "bg-purple-100 text-purple-800",
  general: "bg-gray-100 text-gray-800",
}

export default function NewsList({ news }: NewsListProps) {
  if (news.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-lg font-semibold mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-muted-foreground">Não há notícias que correspondam aos filtros selecionados.</p>
        </CardContent>
      </Card>
    )
  }

  // Separate priority news (featured)
  const featuredNews = news.filter((item) => item.priority > 1)
  const regularNews = news.filter((item) => item.priority <= 1)

  return (
    <div className="space-y-8">
      {/* Featured News */}
      {featuredNews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Destaques</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {item.image_url && (
                  <div className="relative h-48">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-primary-foreground">Destaque</Badge>
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                      {categoryLabels[item.category as keyof typeof categoryLabels]}
                    </Badge>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {item.video_url && <Play className="h-4 w-4" />}
                      {item.audio_url && <Volume2 className="h-4 w-4" />}
                      {item.image_url && <ImageIcon className="h-4 w-4" />}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(item.published_at).toLocaleDateString("pt-BR")}
                    </div>
                    {item.profiles?.full_name && (
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {item.profiles.full_name}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-3">{item.summary}</p>
                  {item.target_region && (
                    <Badge variant="outline" className="mb-4">
                      📍 {item.target_region}
                    </Badge>
                  )}
                  <Button asChild>
                    <Link href={`/news/${item.id}`}>Ler Mais</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular News */}
      {regularNews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Todas as Notícias</h2>
          <div className="space-y-6">
            {regularNews.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <div className="md:flex">
                  {item.image_url && (
                    <div className="md:w-64 h-48 md:h-auto">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={categoryColors[item.category as keyof typeof categoryColors]}>
                          {categoryLabels[item.category as keyof typeof categoryLabels]}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {item.video_url && <Play className="h-4 w-4" />}
                          {item.audio_url && <Volume2 className="h-4 w-4" />}
                          {item.image_url && <ImageIcon className="h-4 w-4" />}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold leading-tight">{item.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(item.published_at).toLocaleDateString("pt-BR")}
                        </div>
                        {item.profiles?.full_name && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {item.profiles.full_name}
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{item.summary}</p>
                      <div className="flex items-center justify-between">
                        <div>{item.target_region && <Badge variant="outline">📍 {item.target_region}</Badge>}</div>
                        <Button variant="outline" asChild>
                          <Link href={`/news/${item.id}`}>Ler Mais</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
