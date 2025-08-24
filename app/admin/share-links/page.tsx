import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/back-button"
import { createShareLink, updateShareLink, deleteShareLink } from "@/lib/share-actions"
import { Trash2, Edit, Plus } from "lucide-react"

export default async function AdminShareLinksPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin" && me?.role !== "coordinator") redirect("/admin?error=Acesso negado")

  const { data: links } = await supabase
    .from("share_links")
    .select("id, label, path, message, icon, color, order_index, active, created_at")
    .order("order_index", { ascending: true })

  const iconOptions = [
    "Share2", "Home", "Newspaper", "Calendar", "BookOpen", "Radio", "Users", 
    "MapPin", "Zap", "Trophy", "Star", "Heart", "Flag", "Target", "Award"
  ]

  const colorOptions = [
    "text-red-600", "text-blue-600", "text-green-600", "text-purple-600", 
    "text-teal-600", "text-pink-600", "text-yellow-600", "text-orange-600",
    "text-gray-600", "text-indigo-600"
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 text-white"><BackButton fallback="/admin" /></div>
      
      {searchParams.message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {searchParams.message}
        </div>
      )}
      
      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {searchParams.error}
        </div>
      )}

      <Card className="border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle>Gestão de Links de Compartilhamento</CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-6">
          
          {/* Form to create new link */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-semibold mb-4">Adicionar Novo Link</h3>
            <form action={createShareLink} className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input id="label" name="label" required placeholder="Ex: Notícias" />
              </div>
              <div>
                <Label htmlFor="path">Path ou URL</Label>
                <Input id="path" name="path" required placeholder="Ex: /news ou https://instagram.com/perfil" />
              </div>
              <div>
                <Label htmlFor="icon">Ícone</Label>
                <Select name="icon" defaultValue="Share2">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="color">Cor</Label>
                <Select name="color" defaultValue="text-red-600">
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {colorOptions.map((color) => (
                      <SelectItem key={color} value={color}>{color}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="message">Mensagem (opcional)</Label>
                <Input id="message" name="message" placeholder="Mensagem personalizada para compartilhamento" />
              </div>
              <div>
                <Label htmlFor="order_index">Ordem</Label>
                <Input id="order_index" name="order_index" type="number" defaultValue="0" />
              </div>
              <div>
                <Label htmlFor="active">Ativo</Label>
                <Select name="active" defaultValue="true">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Sim</SelectItem>
                    <SelectItem value="false">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-4">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Link
                </Button>
              </div>
            </form>
          </div>

          {/* List of existing links */}
          <div>
            <h3 className="font-semibold mb-4">Links Existentes</h3>
            <div className="space-y-3">
              {(links || []).map((link) => (
                <div key={link.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${link.color} bg-gray-100`}>
                        <span className="text-xs font-bold">{link.icon}</span>
                      </div>
                      <div>
                        <div className="font-semibold">{link.label}</div>
                        <div className="text-sm text-gray-600">{link.path}</div>
                        {link.message && (
                          <div className="text-xs text-gray-500 mt-1">{link.message}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-xs text-gray-500">
                        Ordem: {link.order_index} | {link.active ? "Ativo" : "Inativo"}
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <form action={deleteShareLink} className="inline">
                        <input type="hidden" name="id" value={link.id} />
                        <Button type="submit" variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
              {(!links || links.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum link de compartilhamento cadastrado.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
