"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, ExternalLink, MessageCircle, Instagram, Facebook } from "lucide-react"

const mockMovements = [
  {
    id: 1,
    name: "Coletivo Feminista Dandara",
    description:
      "Movimento feminista popular que atua na zona norte do Rio, promovendo formação política e ações de combate à violência contra a mulher.",
    category: "Feminista",
    region: "Zona Norte",
    members: 150,
    founded: "2018",
    contact: {
      whatsapp: "21999887766",
      instagram: "@dandara_feminista",
      facebook: "DandaraFeminista",
    },
    nextEvent: "Roda de Conversa - Violência Doméstica",
    eventDate: "2024-01-20",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Movimento Negro Unificado RJ",
    description:
      "Organização histórica do movimento negro brasileiro, atuando na luta antirracista e pela igualdade racial no Rio de Janeiro.",
    category: "Movimento Negro",
    region: "Centro",
    members: 300,
    founded: "1978",
    contact: {
      whatsapp: "21988776655",
      instagram: "@mnu_rj",
      facebook: "MNURioDeJaneiro",
    },
    nextEvent: "Marcha Contra o Racismo",
    eventDate: "2024-01-25",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Coletivo LGBTQIA+ Resistência",
    description:
      "Coletivo que luta pelos direitos da população LGBTQIA+ no Rio, organizando ações de visibilidade e combate à LGBTfobia.",
    category: "LGBTQIA+",
    region: "Zona Sul",
    members: 80,
    founded: "2020",
    contact: {
      whatsapp: "21977665544",
      instagram: "@resistencia_lgbtqia",
      facebook: "ResistenciaLGBTQIA",
    },
    nextEvent: "Parada do Orgulho LGBTQIA+",
    eventDate: "2024-02-15",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Sindicato dos Metalúrgicos RJ",
    description:
      "Sindicato que representa os trabalhadores metalúrgicos do Rio de Janeiro, lutando por melhores condições de trabalho e salários dignos.",
    category: "Sindical",
    region: "Zona Oeste",
    members: 2500,
    founded: "1985",
    contact: {
      whatsapp: "21966554433",
      instagram: "@metalurgicos_rj",
      facebook: "MetalurgicosRJ",
    },
    nextEvent: "Assembleia Geral dos Trabalhadores",
    eventDate: "2024-01-18",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export function MovementsList() {
  const joinWhatsApp = (phone: string, movementName: string) => {
    const message = `Olá! Gostaria de saber mais sobre o ${movementName} e como posso participar.`
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const openSocialMedia = (platform: string, handle: string) => {
    let url = ""
    switch (platform) {
      case "instagram":
        url = `https://instagram.com/${handle.replace("@", "")}`
        break
      case "facebook":
        url = `https://facebook.com/${handle}`
        break
    }
    window.open(url, "_blank")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-800">{mockMovements.length} movimentos encontrados</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockMovements.map((movement) => (
          <Card key={movement.id} className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={movement.image || "/placeholder.svg"}
                  alt={movement.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-red-600">{movement.category}</Badge>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">{movement.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{movement.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {movement.region}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {movement.members} membros • Fundado em {movement.founded}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Próximo: {movement.nextEvent}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => joinWhatsApp(movement.contact.whatsapp, movement.name)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSocialMedia("instagram", movement.contact.instagram)}
                    >
                      <Instagram className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openSocialMedia("facebook", movement.contact.facebook)}
                    >
                      <Facebook className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Ver Mais
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
