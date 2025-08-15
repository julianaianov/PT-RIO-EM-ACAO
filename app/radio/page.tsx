import { Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioPlayer } from "@/components/radio-player"
import { PodcastsList } from "@/components/podcasts-list"

export default function RadioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-800 mb-2">Rádio PT RJ</h1>
          <p className="text-red-600">A voz da transformação social no Rio de Janeiro</p>
        </div>

        {/* Live Radio Player */}
        <Card className="mb-8 border-red-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">AO VIVO</CardTitle>
                <p className="text-red-100">Transmissão em tempo real</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">1.2k ouvintes</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <RadioPlayer />
          </CardContent>
        </Card>

        {/* Program Schedule */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-red-800">Programação de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: "08:00", program: "Bom Dia Trabalhador", host: "Maria Silva", current: false },
                { time: "10:00", program: "Debate Político", host: "João Santos", current: true },
                { time: "12:00", program: "Almoço com Notícias", host: "Ana Costa", current: false },
                { time: "14:00", program: "Formação Popular", host: "Carlos Lima", current: false },
                { time: "16:00", program: "Movimentos Sociais", host: "Lucia Ferreira", current: false },
                { time: "18:00", program: "Hora do Rush", host: "Pedro Oliveira", current: false },
              ].map((show, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    show.current ? "bg-red-100 border-l-4 border-red-500" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-mono text-gray-600">{show.time}</div>
                    <div>
                      <div className={`font-semibold ${show.current ? "text-red-700" : "text-gray-800"}`}>
                        {show.program}
                      </div>
                      <div className="text-sm text-gray-600">com {show.host}</div>
                    </div>
                  </div>
                  {show.current && (
                    <Badge variant="secondary" className="bg-red-500 text-white">
                      NO AR
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Podcasts Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-800">Podcasts e Programas</CardTitle>
            <p className="text-gray-600">Ouça quando quiser</p>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Carregando podcasts...</div>}>
              <PodcastsList />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
