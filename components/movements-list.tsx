"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, ExternalLink, MessageCircle, Instagram, Facebook } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

interface Movement {
  id: string
  name: string
  description: string
  category: string | null
  region: string | null
  members: number | null
  founded: string | null
  contact_whatsapp: string | null
  contact_instagram: string | null
  contact_facebook: string | null
  contact_email: string | null
  website: string | null
  image_url: string | null
}

export function MovementsList() {
  const [movements, setMovements] = useState<Movement[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    ;(async () => {
      const { data, error } = await supabase
        .from("movements")
        .select(
          "id, name, description, category, region, members, founded, contact_whatsapp, contact_instagram, contact_facebook, contact_email, website, image_url"
        )
        .order("created_at", { ascending: false })
      if (isMounted) {
        if (error) {
          setMovements([])
        } else {
          setMovements(data as unknown as Movement[])
        }
        setLoading(false)
      }
    })()
    return () => {
      isMounted = false
    }
  }, [])

  const formatWhatsAppLink = (phone?: string | null, movementName?: string) => {
    if (!phone) return null
    const sanitized = phone.replace(/[^0-9]/g, "")
    const message = `Olá! Gostaria de saber mais sobre o ${movementName || "movimento"} e como posso participar.`
    return `https://wa.me/55${sanitized}?text=${encodeURIComponent(message)}`
  }

  if (loading) {
    return <div className="text-sm text-gray-600">Carregando movimentos...</div>
  }

  if (!movements || movements.length === 0) {
    return <div className="text-sm text-gray-600">Nenhum movimento cadastrado ainda.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-red-800">{movements.length} movimentos encontrados</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {movements.map((movement) => (
          <Card key={movement.id} className="hover:shadow-lg transition-shadow border-red-200">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={movement.image_url || "/placeholder.svg"}
                  alt={movement.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {movement.category && (
                  <Badge className="absolute top-3 left-3 bg-red-600">{movement.category}</Badge>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">{movement.name}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{movement.description}</p>

                <div className="space-y-2 mb-4">
                  {movement.region && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {movement.region}
                    </div>
                  )}
                  {(movement.members || movement.founded) && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      {movement.members ? `${movement.members} membros` : null}
                      {movement.members && movement.founded ? " • " : null}
                      {movement.founded ? `Fundado em ${movement.founded}` : null}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {formatWhatsAppLink(movement.contact_whatsapp, movement.name) && (
                      <Button size="sm" asChild className="bg-green-600 hover:bg-green-700">
                        <a
                          href={formatWhatsAppLink(movement.contact_whatsapp, movement.name) as string}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                        </a>
                      </Button>
                    )}
                    {movement.contact_instagram && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://instagram.com/${movement.contact_instagram.replace("@", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                    {movement.contact_facebook && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={`https://facebook.com/${movement.contact_facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Facebook className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/movements/${movement.id}`}>
                      <ExternalLink className="h-3 w-3 mr-1" /> Ver Mais
                    </Link>
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
