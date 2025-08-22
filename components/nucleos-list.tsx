import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

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

interface NucleosListProps {
  nucleos: Nucleo[]
}

export default function NucleosList({ nucleos }: NucleosListProps) {
  if (nucleos.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum núcleo encontrado</h3>
          <p className="text-muted-foreground">Não há núcleos que correspondam aos filtros selecionados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {nucleos.map((nucleo) => {
        const isPtRjCard =
          (nucleo.city || "").toLowerCase() === "rio de janeiro" &&
          (/pt rio/.test((nucleo.name || "").toLowerCase()) || nucleo.id === "pt-rj-fallback")

        return (
          <Card key={nucleo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl mb-2">{nucleo.name}</CardTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {nucleo.neighborhood && `${nucleo.neighborhood}, `}
                      {nucleo.city}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">Ativo</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {nucleo.description && <p className="text-muted-foreground mb-4">{nucleo.description}</p>}

              {nucleo.address && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Endereço</h4>
                  <p className="text-sm text-muted-foreground">{nucleo.address}</p>
                </div>
              )}

              {/* Destaque de liderança do PT RJ */}
              {isPtRjCard && (
                <div className="mb-4 flex items-center gap-4">
                  <img
                    src="/ZE.jpg"
                    alt="DIEGO ZEIDAN"
                    className="w-24 h-32 object-cover rounded-md border"
                  />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">presidente estadual pt rj</div>
                    <div className="text-lg font-bold leading-tight">DIEGO ZEIDAN</div>
                  </div>
                </div>
              )}

              {nucleo.contact_name && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-1">Contato de Referência</h4>
                  <p className="text-sm text-muted-foreground">{nucleo.contact_name}</p>
                  {nucleo.contact_phone && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{nucleo.contact_phone}</span>
                    </div>
                  )}
                  {nucleo.contact_email && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Mail className="h-3 w-3" />
                      <span>{nucleo.contact_email}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/nucleos/${nucleo.id}`}>Ver Detalhes</Link>
                </Button>

                {nucleo.whatsapp_link && (
                  <Button variant="outline" asChild>
                    <a href={nucleo.whatsapp_link} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                )}

                {nucleo.telegram_link && (
                  <Button variant="outline" asChild>
                    <a href={nucleo.telegram_link} target="_blank" rel="noopener noreferrer">
                      <Send className="h-4 w-4 mr-2" />
                      Telegram
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
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
