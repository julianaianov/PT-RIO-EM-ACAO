import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createNucleo } from "@/lib/nucleo-actions"

export default async function CreateNucleoPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/nucleos?error=Acesso negado")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/nucleos">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Núcleos
          </Link>
        </Button>
      </div>

      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800">Novo Núcleo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createNucleo} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" name="name" required placeholder="Nome do núcleo" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Objetivo, público, histórico, etc." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" name="city" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input id="neighborhood" name="neighborhood" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Endereço</Label>
              <Input id="address" name="address" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact_name">Contato - Nome</Label>
              <Input id="contact_name" name="contact_name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Contato - Telefone</Label>
              <Input id="contact_phone" name="contact_phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_email">Contato - Email</Label>
              <Input id="contact_email" name="contact_email" type="email" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp_link">WhatsApp (link)</Label>
              <Input id="whatsapp_link" name="whatsapp_link" placeholder="https://chat.whatsapp.com/..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telegram_link">Telegram (link)</Label>
              <Input id="telegram_link" name="telegram_link" placeholder="https://t.me/..." />
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