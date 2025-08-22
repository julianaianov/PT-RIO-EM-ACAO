import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, MessageCircle, Instagram, Facebook, Mail, Globe, Pencil } from "lucide-react"
import Link from "next/link"
import { deleteMovement } from "@/lib/movement-actions"
import BackButton from "@/components/back-button"

export default async function MovementDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let canEdit = false
  if (user) {
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    canEdit = !!me && ["admin", "coordinator"].includes(me.role)
  }

  const { data: movement } = await supabase
    .from("movements")
    .select(
      "id, name, description, category, region, members, founded, contact_whatsapp, contact_instagram, contact_facebook, contact_email, website, image_url"
    )
    .eq("id", params.id)
    .single()

  if (!movement) notFound()

  const whatsappLink = movement.contact_whatsapp
    ? `https://wa.me/55${movement.contact_whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Olá! Gostaria de saber mais sobre o ${movement.name} e como posso participar.`
      )}`
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6"><BackButton fallback="/movements" /></div>

        {/* Hero */}
        <Card className="mb-8 border-red-200">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={movement.image_url || "/placeholder.svg"}
                alt={movement.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/40 rounded-t-lg" />
              <div className="absolute bottom-4 left-4 text-white right-4">
                {movement.category && <Badge className="mb-2 bg-red-600">{movement.category}</Badge>}
                <h1 className="text-3xl font-bold">{movement.name}</h1>
                <p className="text-red-100 line-clamp-3">{movement.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {canEdit && (
          <div className="mb-6 flex gap-2">
            <Link href={`/movements/${movement.id}/edit`}>
              <Button className="bg-red-600 hover:bg-red-700">
                <Pencil className="h-4 w-4 mr-2" /> Editar
              </Button>
            </Link>
            <form
              action={deleteMovement}
              onSubmit={(e) => {
                // simple confirm guard on server component via inline script attribute
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (!(globalThis as any).confirm?.("Tem certeza que deseja excluir este movimento? Esta ação não pode ser desfeita.")) {
                  e.preventDefault()
                }
              }}
            >
              <input type="hidden" name="id" value={movement.id} />
              <Button type="submit" variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
                Excluir
              </Button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Sobre o Movimento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">{movement.description}</p>
              </CardContent>
            </Card>

            {/* Info rápida */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {movement.members && (
                  <div className="flex items-center gap-2"><Users className="h-4 w-4 text-red-600" />{movement.members} membros</div>
                )}
                {movement.founded && (
                  <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-red-600" />Fundado em {movement.founded}</div>
                )}
                {movement.region && (
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-red-600" />{movement.region}</div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {whatsappLink && (
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                    </a>
                  </Button>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {movement.contact_instagram && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={`https://instagram.com/${movement.contact_instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-3 w-3 mr-1" /> Instagram
                      </a>
                    </Button>
                  )}
                  {movement.contact_facebook && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={`https://facebook.com/${movement.contact_facebook}`} target="_blank" rel="noopener noreferrer">
                        <Facebook className="h-3 w-3 mr-1" /> Facebook
                      </a>
                    </Button>
                  )}
                </div>
                {movement.contact_email && (
                  <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-red-600" />{movement.contact_email}</div>
                )}
                {movement.website && (
                  <div className="flex items-center gap-2 text-sm"><Globe className="h-4 w-4 text-red-600" />{movement.website}</div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
