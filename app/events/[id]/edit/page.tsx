import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { updateEvent } from "@/lib/event-actions"

export default async function EditEventPage({ 
  params, 
  searchParams 
}: { 
  params: { id: string }
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()
  
  // Verificar permissões do usuário
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect(`/events/${params.id}?error=Acesso negado`)

  // Buscar dados do evento
  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-white hover:bg-white/10">
          <Link href={`/events/${params.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Evento
          </Link>
        </Button>
      </div>

      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{searchParams.error}</p>
        </div>
      )}

      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800">Editar Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateEvent} className="grid md:grid-cols-2 gap-6">
            <input type="hidden" name="event_id" value={event.id} />

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input 
                id="title" 
                name="title" 
                defaultValue={event.title || ""} 
                required 
                placeholder="Título do evento" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Data e hora</Label>
              <Input 
                id="event_date" 
                name="event_date" 
                type="datetime-local" 
                defaultValue={event.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : ""}
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Tipo</Label>
              <Input 
                id="event_type" 
                name="event_type" 
                defaultValue={event.event_type || ""}
                placeholder="meeting, protest, course..." 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input 
                id="city" 
                name="city" 
                defaultValue={event.city || ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input 
                id="neighborhood" 
                name="neighborhood" 
                defaultValue={event.neighborhood || ""}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Local</Label>
              <Input 
                id="location" 
                name="location" 
                defaultValue={event.location || ""}
                placeholder="Endereço ou referência" 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="max_participants">Máximo de participantes</Label>
              <Input 
                id="max_participants" 
                name="max_participants" 
                type="number" 
                min="0"
                defaultValue={event.max_participants || ""}
                placeholder="Deixe vazio para ilimitado" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={6}
                defaultValue={event.description || ""}
                placeholder="Descreva o evento..." 
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4">
              <Button variant="outline" asChild>
                <Link href={`/events/${params.id}`}>Cancelar</Link>
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
