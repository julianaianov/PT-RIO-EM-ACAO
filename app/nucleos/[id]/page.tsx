import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, MessageCircle, Send, ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import BackButton from "@/components/back-button"

export default async function NucleoDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get nucleo details
  const { data: nucleo, error } = await supabase.from("nucleos").select("*").eq("id", params.id).single()

  if (error || !nucleo) {
    notFound()
  }

  // Get members count (mock for now)
  const membersCount = Math.floor(Math.random() * 50) + 10

  // Get recent events for this nucleo (mock)
  const recentEvents = [
    {
      id: 1,
      title: "Reunião Mensal do Núcleo",
      date: "2024-01-25T19:00:00Z",
      participants: 15,
    },
    {
      id: 2,
      title: "Formação Política: História do PT",
      date: "2024-01-30T18:00:00Z",
      participants: 8,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6"><BackButton /></div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary">Núcleo Ativo</Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{membersCount} membros</span>
                </div>
              </div>
              <CardTitle className="text-3xl mb-4">{nucleo.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {nucleo.neighborhood && `${nucleo.neighborhood}, `}
                  {nucleo.city}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              {nucleo.description && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Sobre o Núcleo</h3>
                  <p className="text-muted-foreground leading-relaxed">{nucleo.description}</p>
                </div>
              )}

              {nucleo.address && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Endereço</h3>
                  <p className="text-muted-foreground">{nucleo.address}</p>
                </div>
              )}

              {nucleo.contact_name && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Contato de Referência</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{nucleo.contact_name}</p>
                    {nucleo.contact_phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{nucleo.contact_phone}</span>
                      </div>
                    )}
                    {nucleo.contact_email && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{nucleo.contact_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {nucleo.whatsapp_link && (
                  <Button asChild>
                    <a href={nucleo.whatsapp_link} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Entrar no WhatsApp
                    </a>
                  </Button>
                )}

                {nucleo.telegram_link && (
                  <Button variant="outline" asChild>
                    <a href={nucleo.telegram_link} target="_blank" rel="noopener noreferrer">
                      <Send className="h-4 w-4 mr-2" />
                      Entrar no Telegram
                    </a>
                  </Button>
                )}

                {nucleo.contact_phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${nucleo.contact_phone}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Ligar
                    </a>
                  </Button>
                )}

                {nucleo.contact_email && (
                  <Button variant="outline" asChild>
                    <a href={`mailto:${nucleo.contact_email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Email
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/events?city=${nucleo.city}">Ver Eventos da Região</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/news?region=${nucleo.neighborhood || nucleo.city}">Notícias Locais</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/courses">Cursos de Formação</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Events */}
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {recentEvents.length > 0 ? (
                <div className="space-y-3">
                  {recentEvents.map((event) => (
                    <div key={event.id} className="border-l-2 border-primary pl-3">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(event.date).toLocaleDateString("pt-BR")} • {event.participants} participantes
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum evento recente.</p>
              )}
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card>
            <CardHeader>
              <CardTitle>Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Mapa da localização</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {nucleo.neighborhood && `${nucleo.neighborhood}, `}
                {nucleo.city}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
