import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import BackButton from "@/components/back-button"
import { createShareItem, deleteShareItem } from "@/lib/admin-actions"

export default async function AdminSharePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin" && me?.role !== "coordinator") redirect("/admin?error=Acesso negado")

  const { data: items } = await supabase
    .from("share_items")
    .select("id, title, summary, image_url, target_url, created_at")
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 text-white"><BackButton fallback="/admin" /></div>
      <Card className="border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle>Conteúdos para Compartilhar</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          <form action={createShareItem} className="grid md:grid-cols-4 gap-3 items-end border rounded p-3">
            <div className="md:col-span-2">
              <Label>Título</Label>
              <Input name="title" required />
            </div>
            <div className="md:col-span-2">
              <Label>Resumo</Label>
              <Input name="summary" />
            </div>
            <div className="md:col-span-2">
              <Label>URL do conteúdo</Label>
              <Input name="target_url" placeholder="https://... ou /news/abc" required />
            </div>
            <div className="md:col-span-2">
              <Label>Imagem (opcional)</Label>
              <Input name="image_url" placeholder="https://..." />
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button className="bg-red-600 hover:bg-red-700">Adicionar</Button>
            </div>
          </form>

          <div className="space-y-3">
            {(items || []).map((it) => (
              <form key={it.id} action={deleteShareItem} className="grid md:grid-cols-6 gap-2 items-center border rounded p-3">
                <input type="hidden" name="id" value={it.id} />
                <div className="md:col-span-2 font-semibold text-gray-900">{it.title}</div>
                <div className="md:col-span-2 text-sm text-gray-700 truncate">{it.target_url}</div>
                <div className="text-xs text-gray-500">{new Date(it.created_at as any).toLocaleString("pt-BR")}</div>
                <div className="flex justify-end">
                  <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                </div>
              </form>
            ))}
            {(!items || items.length === 0) && (
              <div className="text-sm text-gray-600">Nenhum conteúdo cadastrado ainda.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


