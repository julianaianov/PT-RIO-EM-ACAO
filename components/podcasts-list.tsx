"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Download, Share2, Clock, Calendar } from "lucide-react"

const mockPodcasts = [
  {
    id: 1,
    title: "Análise da Conjuntura Política",
    description: "Discussão sobre os principais acontecimentos políticos da semana",
    duration: "45:30",
    date: "2024-01-15",
    category: "Política",
    plays: 1250,
    audioUrl: "https://example.com/podcast1.mp3",
  },
  {
    id: 2,
    title: "Movimentos Sociais em Ação",
    description: "Entrevista com lideranças dos movimentos sociais do Rio de Janeiro",
    duration: "32:15",
    date: "2024-01-12",
    category: "Social",
    plays: 890,
    audioUrl: "https://example.com/podcast2.mp3",
  },
  {
    id: 3,
    title: "Formação: História do PT",
    description: "Episódio especial sobre a fundação e trajetória do Partido dos Trabalhadores",
    duration: "58:45",
    date: "2024-01-10",
    category: "Formação",
    plays: 2100,
    audioUrl: "https://example.com/podcast3.mp3",
  },
  {
    id: 4,
    title: "Juventude e Política",
    description: "Debate sobre o papel da juventude na transformação social",
    duration: "41:20",
    date: "2024-01-08",
    category: "Juventude",
    plays: 675,
    audioUrl: "https://example.com/podcast4.mp3",
  },
]

export function PodcastsList() {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [filter, setFilter] = useState<string>("all")

  const categories = ["all", "Política", "Social", "Formação", "Juventude"]

  const filteredPodcasts =
    filter === "all" ? mockPodcasts : mockPodcasts.filter((podcast) => podcast.category === filter)

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  const sharePodcast = (podcast: any) => {
    const text = `Ouça: ${podcast.title} - ${podcast.description}`
    const url = `${window.location.origin}/radio?podcast=${podcast.id}`

    if (navigator.share) {
      navigator.share({ title: podcast.title, text, url })
    } else {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
      window.open(whatsappUrl, "_blank")
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
            className={filter === category ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {category === "all" ? "Todos" : category}
          </Button>
        ))}
      </div>

      {/* Podcasts List */}
      <div className="space-y-4">
        {filteredPodcasts.map((podcast) => (
          <Card key={podcast.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Button
                  size="icon"
                  onClick={() => togglePlay(podcast.id)}
                  className="bg-red-600 hover:bg-red-700 shrink-0"
                >
                  {playingId === podcast.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">{podcast.title}</h3>
                    <Badge variant="secondary" className="shrink-0">
                      {podcast.category}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{podcast.description}</p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {podcast.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(podcast.date).toLocaleDateString("pt-BR")}
                      </div>
                      <div>{podcast.plays} reproduções</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => sharePodcast(podcast)}>
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPodcasts.length === 0 && (
        <div className="text-center py-8 text-gray-500">Nenhum podcast encontrado nesta categoria.</div>
      )}
    </div>
  )
}
