import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createEvent } from "@/lib/event-actions"

export default async function CreateEventPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/events?error=Acesso negado")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/events">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Agenda
          </Link>
        </Button>
      </div>

      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800">Criar Evento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEvent} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" required placeholder="Título do evento" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_date">Data e hora</Label>
              <Input id="event_date" name="event_date" type="datetime-local" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event_type">Tipo</Label>
              <Input id="event_type" name="event_type" placeholder="meeting, protest, course..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" name="neighborhood" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">Local</Label>
              <Input id="location" name="location" placeholder="Endereço ou referência" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="max_participants">Máximo de participantes</Label>
              <Input id="max_participants" name="max_participants" type="number" min={0} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Detalhes do evento" />
            </div>

            <div className="md:col-span-2">
              <Button type="submit" className="bg-red-600 hover:bg-red-700">Criar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 