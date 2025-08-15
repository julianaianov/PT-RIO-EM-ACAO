"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, MessageCircle, Send, Phone } from "lucide-react"
import { useState } from "react"

interface Nucleo {
  id: string
  name: string
  description: string | null
  city: string
  neighborhood: string | null
  address: string | null
  contact_name: string | null
  contact_phone: string | null
  contact_email: string | null
  whatsapp_link: string | null
  telegram_link: string | null
  latitude: number | null
  longitude: number | null
}

interface NucleosMapProps {
  nucleos: Nucleo[]
}

export default function NucleosMap({ nucleos }: NucleosMapProps) {
  const [selectedNucleo, setSelectedNucleo] = useState<Nucleo | null>(null)

  // Mock coordinates for Rio de Janeiro area
  const mockCoordinates = [
    { lat: -22.9068, lng: -43.1729 }, // Centro
    { lat: -22.9711, lng: -43.1822 }, // Copacabana
    { lat: -22.9849, lng: -43.1949 }, // Ipanema
    { lat: -22.9249, lng: -43.2311 }, // Tijuca
    { lat: -22.9519, lng: -43.2105 }, // Botafogo
    { lat: -22.9129, lng: -43.2003 }, // Santa Teresa
    { lat: -22.8305, lng: -43.2192 }, // Barra da Tijuca
    { lat: -22.8833, lng: -43.1036 }, // Niterói
  ]

  // Assign mock coordinates to nucleos that don't have them
  const nucleosWithCoords = nucleos.map((nucleo, index) => ({
    ...nucleo,
    latitude: nucleo.latitude || mockCoordinates[index % mockCoordinates.length]?.lat || -22.9068,
    longitude: nucleo.longitude || mockCoordinates[index % mockCoordinates.length]?.lng || -43.1729,
  }))

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
            {/* Mock Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Mapa Interativo dos Núcleos PT RJ</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Clique nos pins abaixo para ver informações dos núcleos
                </p>
              </div>
            </div>

            {/* Mock Map Pins */}
            <div className="absolute inset-0">
              {nucleosWithCoords.map((nucleo, index) => {
                const x = ((nucleo.longitude + 43.3) / 0.4) * 100 // Convert lng to percentage
                const y = ((nucleo.latitude + 23.1) / 0.4) * 100 // Convert lat to percentage

                return (
                  <button
                    key={nucleo.id}
                    className={`absolute w-6 h-6 rounded-full border-2 border-white shadow-lg transition-all hover:scale-110 ${
                      selectedNucleo?.id === nucleo.id ? "bg-primary scale-110" : "bg-red-500"
                    }`}
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, 100 - y))}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => setSelectedNucleo(nucleo)}
                    title={nucleo.name}
                  >
                    <MapPin className="h-4 w-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </button>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Nucleo Info */}
      {selectedNucleo && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold mb-2">{selectedNucleo.name}</h3>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {selectedNucleo.neighborhood && `${selectedNucleo.neighborhood}, `}
                    {selectedNucleo.city}
                  </span>
                </div>
              </div>
              <Badge variant="secondary">Selecionado</Badge>
            </div>

            {selectedNucleo.description && <p className="text-muted-foreground mb-4">{selectedNucleo.description}</p>}

            {selectedNucleo.address && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Endereço</h4>
                <p className="text-sm text-muted-foreground">{selectedNucleo.address}</p>
              </div>
            )}

            {selectedNucleo.contact_name && (
              <div className="mb-4">
                <h4 className="font-semibold mb-1">Contato de Referência</h4>
                <p className="text-sm text-muted-foreground">{selectedNucleo.contact_name}</p>
                {selectedNucleo.contact_phone && (
                  <p className="text-sm text-muted-foreground">{selectedNucleo.contact_phone}</p>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {selectedNucleo.whatsapp_link && (
                <Button size="sm" asChild>
                  <a href={selectedNucleo.whatsapp_link} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Entrar no WhatsApp
                  </a>
                </Button>
              )}

              {selectedNucleo.telegram_link && (
                <Button size="sm" variant="outline" asChild>
                  <a href={selectedNucleo.telegram_link} target="_blank" rel="noopener noreferrer">
                    <Send className="h-4 w-4 mr-2" />
                    Entrar no Telegram
                  </a>
                </Button>
              )}

              {selectedNucleo.contact_phone && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${selectedNucleo.contact_phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar
                  </a>
                </Button>
              )}

              <Button size="sm" variant="outline" onClick={() => setSelectedNucleo(null)}>
                Fechar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nucleos List for Map */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Núcleos Disponíveis ({nucleos.length})</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {nucleos.map((nucleo) => (
              <button
                key={nucleo.id}
                className={`text-left p-3 rounded-lg border transition-colors hover:bg-muted ${
                  selectedNucleo?.id === nucleo.id ? "bg-primary/10 border-primary" : "border-border"
                }`}
                onClick={() => setSelectedNucleo(nucleo)}
              >
                <div className="font-medium">{nucleo.name}</div>
                <div className="text-sm text-muted-foreground">
                  {nucleo.neighborhood && `${nucleo.neighborhood}, `}
                  {nucleo.city}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
