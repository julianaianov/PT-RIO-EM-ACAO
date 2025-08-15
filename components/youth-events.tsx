import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Hackathon: Soluções para a Cidade",
    description: "48h criando apps e soluções tecnológicas para problemas urbanos do Rio",
    date: "2024-01-22",
    time: "09:00",
    location: "UFRJ - Campus Fundão",
    category: "Tecnologia",
    participants: 45,
    maxParticipants: 60,
    type: "Presencial",
    organizer: "Coletivo Tech Jovem",
  },
  {
    id: 2,
    title: "Debate: Juventude e Mercado de Trabalho",
    description: "Discussão sobre desemprego jovem e políticas públicas de emprego",
    date: "2024-01-25",
    time: "19:00",
    location: "Online via Zoom",
    category: "Debate",
    participants: 78,
    maxParticipants: 100,
    type: "Online",
    organizer: "Núcleo Juventude PT RJ",
  },
  {
    id: 3,
    title: "Oficina: Comunicação Política Digital",
    description: "Aprenda a usar redes sociais para mobilização e engajamento político",
    date: "2024-01-28",
    time: "14:00",
    location: "Centro Cultural da Juventude",
    category: "Formação",
    participants: 23,
    maxParticipants: 30,
    type: "Presencial",
    organizer: "Escola de Formação PT",
  },
  {
    id: 4,
    title: "Sarau Político-Cultural",
    description: "Noite de poesia, música e arte com temática de resistência e transformação",
    date: "2024-02-02",
    time: "20:00",
    location: "Casa da Juventude - Lapa",
    category: "Cultural",
    participants: 67,
    maxParticipants: 80,
    type: "Presencial",
    organizer: "Coletivo Arte e Luta",
  },
]

export function YouthEvents() {
  const getCategoryColor = (category: string) => {
    const colors = {
      Tecnologia: "bg-blue-100 text-blue-800",
      Debate: "bg-purple-100 text-purple-800",
      Formação: "bg-green-100 text-green-800",
      Cultural: "bg-pink-100 text-pink-800",
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    return type === "Online" ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800">Próximos Eventos da Juventude</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border-l-4 border-orange-500 pl-4 py-3 bg-orange-50 rounded-r-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                  <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {new Date(event.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    {event.time}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {event.participants}/{event.maxParticipants} participantes
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Organizado por {event.organizer}</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Compartilhar
                  </Button>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Participar
                  </Button>
                </div>
              </div>

              {/* Progress bar for participants */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Button variant="outline" className="bg-transparent border-orange-600 text-orange-600 hover:bg-orange-50">
            Ver Todos os Eventos
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
