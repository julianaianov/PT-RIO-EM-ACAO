import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createPartnership, updatePartnership, deletePartnership } from "@/lib/movement-actions"
import BackButton from "@/components/back-button"

export default async function PartnershipsAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let canManage = false
  if (user) {
    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    canManage = !!me && ["admin", "coordinator"].includes(me.role)
  }

  if (!canManage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <BackButton fallback="/movements" />
          <Card className="mt-4 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Acesso negado</CardTitle>
            </CardHeader>
            <CardContent className="p-6">Você não tem permissão para gerenciar parcerias.</CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const { data: partnerships } = await supabase
    .from("movement_partnerships")
    .select("id, name, partnership_type, members_info, order_index, active")
    .order("order_index", { ascending: true, nullsFirst: false })

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        <div className="flex items-center justify-between mb-4">
          <BackButton fallback="/movements" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Criar Parceria</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form action={createPartnership} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="partnership_type">Tipo</Label>
                  <Input id="partnership_type" name="partnership_type" placeholder="Articulação Nacional, Movimento Juvenil..." />
                </div>
                <div>
                  <Label htmlFor="members_info">Descrição (curta)</Label>
                  <Textarea id="members_info" name="members_info" rows={3} />
                </div>
                <div>
                  <Label htmlFor="order_index">Ordem</Label>
                  <Input id="order_index" name="order_index" type="number" defaultValue={0} />
                </div>
                <div className="flex justify-end">
                  <Button className="bg-red-600 hover:bg-red-700" type="submit">Salvar</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Parcerias Cadastradas</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {(partnerships || []).map((p) => (
                <div key={p.id} className="border border-red-200 rounded-lg p-4 bg-white space-y-3">
                  <form action={updatePartnership} className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input type="hidden" name="id" defaultValue={p.id} />
                    <div>
                      <Label>Nome</Label>
                      <Input name="name" defaultValue={p.name || ""} required />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Input name="partnership_type" defaultValue={p.partnership_type || ""} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Descrição (curta)</Label>
                      <Input name="members_info" defaultValue={p.members_info || ""} />
                    </div>
                    <div>
                      <Label>Ordem</Label>
                      <Input name="order_index" type="number" defaultValue={p.order_index ?? 0} />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button type="submit" className="bg-red-600 hover:bg-red-700">Atualizar</Button>
                      <Button formAction={deletePartnership} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                    </div>
                  </form>
                </div>
              ))}
              {(!partnerships || partnerships.length === 0) && (
                <div className="text-sm text-gray-600">Nenhuma parceria cadastrada.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 