import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createNews } from "@/lib/news-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function CreateNewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/news?error=Acesso negado")

  // Load existing categories and regions for selects
  const [{ data: catRows }, { data: regRows }] = await Promise.all([
    supabase.from("news").select("category").not("category", "is", null),
    supabase.from("news").select("target_region").not("target_region", "is", null),
  ])

  const fallbackCategories = ["general", "politics", "campaign", "social", "formation"]
  const categories = Array.from(new Set([...(catRows?.map((r: any) => r.category) || []), ...fallbackCategories]))
  const regions = Array.from(new Set(regRows?.map((r: any) => r.target_region) || []))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Notícias
          </Link>
        </Button>
      </div>

      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800">Nova Publicação</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createNews} className="grid md:grid-cols-2 gap-6" encType="multipart/form-data">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" required placeholder="Título da notícia" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="summary">Resumo</Label>
              <Textarea id="summary" name="summary" placeholder="Resumo curto para listagens" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea id="content" name="content" required rows={10} placeholder="Texto da notícia" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" defaultValue={categories[0]}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={String(c)}>{String(c)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target_region">Região</Label>
              <Select name="target_region">
                <SelectTrigger id="target_region">
                  <SelectValue placeholder="Todas as regiões" />
                </SelectTrigger>
                <SelectContent>
                  {regions.length === 0 ? (
                    <SelectItem value="">Sem regiões cadastradas</SelectItem>
                  ) : (
                    regions.map((r) => <SelectItem key={String(r)} value={String(r)}>{String(r)}</SelectItem>)
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Links diretos */}
            <div className="space-y-2">
              <Label htmlFor="image_url">Link de Imagem (opcional)</Label>
              <Input id="image_url" name="image_url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_url">Link de Vídeo (opcional)</Label>
              <Input id="video_url" name="video_url" placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio_url">Link de Áudio (opcional)</Label>
              <Input id="audio_url" name="audio_url" placeholder="https://..." />
            </div>

            {/* Upload de arquivos */}
            <div className="space-y-2">
              <Label htmlFor="image_file">Anexar Imagem (opcional)</Label>
              <Input id="image_file" name="image_file" type="file" accept="image/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="video_file">Anexar Vídeo (opcional)</Label>
              <Input id="video_file" name="video_file" type="file" accept="video/*" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audio_file">Anexar Áudio (opcional)</Label>
              <Input id="audio_file" name="audio_file" type="file" accept="audio/*" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="links">Outros links (um por linha)</Label>
              <Textarea id="links" name="links" placeholder="https://site-1\nhttps://site-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="published">Publicar agora?</Label>
              <select id="published" name="published" className="border rounded-md h-10 px-3">
                <option value="true">Sim</option>
                <option value="false">Não (rascunho)</option>
              </select>
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