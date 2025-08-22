import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { updateMovement } from "@/lib/movement-actions"
import BackButton from "@/components/back-button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { movementCategories, movementRegions } from "@/lib/movements-options"

export default async function EditMovementPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: movement } = await supabase
    .from("movements")
    .select(
      "id, name, description, category, region, founded, members, contact_whatsapp, contact_instagram, contact_facebook, contact_email, website, image_url"
    )
    .eq("id", params.id)
    .single()

  if (!movement) {
    return <div className="p-6">Movimento não encontrado.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-4"><BackButton fallback={`/movements/${params.id}`} /></div>

        <Card className="border-red-200">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardTitle>Editar Movimento</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form action={updateMovement} className="space-y-6">
              <input type="hidden" name="id" value={movement.id} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" defaultValue={movement.name} required />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <input type="hidden" name="category" id="category" defaultValue={movement.category || ""} />
                  <Select defaultValue={movement.category || undefined} onValueChange={(v) => { const el=document.getElementById('category') as HTMLInputElement; if(el) el.value=v }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {movementCategories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="region">Região</Label>
                  <input type="hidden" name="region" id="region" defaultValue={movement.region || ""} />
                  <Select defaultValue={movement.region || undefined} onValueChange={(v) => { const el=document.getElementById('region') as HTMLInputElement; if(el) el.value=v }}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {movementRegions.map((r) => (
                        <SelectItem key={r} value={r}>{r}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="founded">Fundado em</Label>
                  <Input id="founded" name="founded" defaultValue={movement.founded || ""} />
                </div>
                <div>
                  <Label htmlFor="members">Nº de membros</Label>
                  <Input id="members" name="members" type="number" min={0} defaultValue={movement.members ?? undefined} />
                </div>
                <div>
                  <Label htmlFor="image_url">Imagem (URL)</Label>
                  <Input id="image_url" name="image_url" defaultValue={movement.image_url || ""} />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" rows={5} defaultValue={movement.description} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input id="whatsapp" name="whatsapp" defaultValue={movement.contact_whatsapp || ""} />
                </div>
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" name="instagram" defaultValue={movement.contact_instagram || ""} />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" name="facebook" defaultValue={movement.contact_facebook || ""} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" defaultValue={movement.contact_email || ""} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" name="website" defaultValue={movement.website || ""} />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button variant="outline" className="bg-transparent" type="reset">Limpar</Button>
                <Button className="bg-red-600 hover:bg-red-700" type="submit">Salvar Alterações</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 