import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import NewsShare from "@/components/news-share"
import LinkPreview from "@/components/link-preview"

export default async function NewsDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get news details
  const { data: news, error } = await supabase
    .from("news")
    .select(`
      *,
      profiles!news_created_by_fkey(full_name, email)
    `)
    .eq("id", params.id)
    .eq("published", true)
    .single()

  if (error || !news) {
    notFound()
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

  // Extract links list from content block if present (lines after "Links:")
  const linksSectionIndex = news.content?.indexOf("\n\nLinks:\n") ?? -1
  const linksListRaw =
    linksSectionIndex >= 0 ? news.content.slice(linksSectionIndex + "\n\nLinks:\n".length).trim() : ""
  const linksArray = linksListRaw
    .split(/\r?\n/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.startsWith("http"))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Notícias
          </Link>
        </Button>
      </div>

      <article className="max-w-4xl mx-auto">
        <Card>
          {news.image_url && (
            <div className="relative h-64 md:h-96">
              <img src={news.image_url || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
              {news.priority > 1 && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-primary-foreground">Destaque</Badge>
                </div>
              )}
            </div>
          )}

          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <Badge className={categoryColors[news.category as keyof typeof categoryColors]}>
                {categoryLabels[news.category as keyof typeof categoryLabels]}
              </Badge>
              {news.target_region && <Badge variant="outline">📍 {news.target_region}</Badge>}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">{news.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(news.published_at).toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {news.profiles?.full_name && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {news.profiles.full_name}
                </div>
              )}
            </div>

            {news.summary && (
              <div className="text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-primary pl-4">
                {news.summary}
              </div>
            )}
          </CardHeader>

          <CardContent>
            {/* Video Content */}
            {news.video_url && (
              <div className="mb-6">
                <video controls className="w-full rounded-lg">
                  <source src={news.video_url} type="video/mp4" />
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              </div>
            )}

            {/* Audio Content */}
            {news.audio_url && (
              <div className="mb-6">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Áudio da Notícia</h3>
                  <audio controls className="w-full">
                    <source src={news.audio_url} type="audio/mpeg" />
                    Seu navegador não suporta o elemento de áudio.
                  </audio>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {linksSectionIndex >= 0 ? news.content.slice(0, linksSectionIndex) : news.content}
              </div>
            </div>

            {/* Link previews */}
            {linksArray.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold mb-3">Links</h3>
                <LinkPreview links={linksArray} />
              </div>
            )}

            {/* Share Section */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Compartilhar esta notícia</h3>
              <NewsShare news={news} />
            </div>
          </CardContent>
        </Card>
      </article>
    </div>
  )
}
