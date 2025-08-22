import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export async function YouthEvents() {
  const supabase = await createClient()
  const { data: events } = await supabase
    .from("youth_events")
    .select("id, title, description, event_date, location, category, participants, max_participants, event_type, organizer")
    .order("event_date", { ascending: true })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Tecnologia: "bg-blue-100 text-blue-800",
      Debate: "bg-purple-100 text-purple-800",
      Formação: "bg-green-100 text-green-800",
      Cultural: "bg-pink-100 text-pink-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  const getTypeColor = (type: string) => {
    return type === "Online" ? "bg-red-100 text-red-800" : "bg-red-100 text-red-800"
  }

  function buildShareUrls(e: any) {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/youth/events/${e.id}` : `/youth/events/${e.id}`
    const text = encodeURIComponent(`${e.title} - ${new Date(e.event_date).toLocaleString('pt-BR')}\n${e.description}`)
    const shareUrl = encodeURIComponent(url)
    return {
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      telegram: `https://t.me/share/url?url=${shareUrl}&text=${text}`,
    }
  }

  return (
    <Card className="border-orange-200">
      <CardHeader>
        <CardTitle className="text-orange-800">Próximos Eventos da Juventude</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(events || []).map((event, idx) => {
            const share = buildShareUrls(event)
            return (
              <div key={idx} className="border-l-4 border-red-600 pl-4 py-3 bg-red-50 rounded-r-lg">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Badge className={getCategoryColor(event.category)}>{event.category}</Badge>
                    <Badge className={getTypeColor(event.event_type)}>{event.event_type}</Badge>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                      {new Date(event.event_date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                      {new Date(event.event_date).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                      {event.participants}/{event.max_participants} participantes
                    </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">Organizado por {event.organizer}</div>
                <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                          <Share2 className="h-4 w-4 mr-1" /> Compartilhar
                  </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild><a href={share.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></DropdownMenuItem>
                        <DropdownMenuItem asChild><a href={share.telegram} target="_blank" rel="noreferrer">Telegram</a></DropdownMenuItem>
                        <DropdownMenuItem asChild><a href={share.twitter} target="_blank" rel="noreferrer">Twitter/X</a></DropdownMenuItem>
                        <DropdownMenuItem asChild><a href={share.facebook} target="_blank" rel="noreferrer">Facebook</a></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button asChild size="sm" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                      <Link href={`/youth/events/${event.id}`}>Participar</Link>
                  </Button>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                      className="bg-gradient-to-r from-red-500 to-red-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.participants / (event.max_participants || 1)) * 100}%` }}
                  ></div>
                  </div>
                </div>
              </div>
            )
          })}
          {(!events || events.length === 0) && (
            <div className="text-sm text-gray-600">Nenhum evento encontrado.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
