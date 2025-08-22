import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createCourse } from "@/lib/course-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import CoverUploader from "@/components/cover-uploader"

export default async function CreateCoursePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin","coordinator"].includes(me.role)) redirect("/courses?error=Acesso negado")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Formação
          </Link>
        </Button>
      </div>

      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800">Novo Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createCourse} className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input id="title" name="title" required placeholder="Título do curso" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea id="description" name="description" placeholder="Breve descrição" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea id="content" name="content" rows={10} placeholder="Conteúdo detalhado" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select name="category" defaultValue="history">
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="history">História</SelectItem>
                  <SelectItem value="politics">Política</SelectItem>
                  <SelectItem value="economics">Economia</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="campaign">Campanha</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="difficulty">Nível</Label>
              <Select name="difficulty" defaultValue="beginner">
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Iniciante</SelectItem>
                  <SelectItem value="intermediate">Intermediário</SelectItem>
                  <SelectItem value="advanced">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duração (min)</Label>
              <Input id="duration_minutes" name="duration_minutes" type="number" min={0} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points_reward">Pontos ao concluir</Label>
              <Input id="points_reward" name="points_reward" type="number" min={0} defaultValue={10} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="video_url">Link de Vídeo (opcional)</Label>
              <Input id="video_url" name="video_url" placeholder="https://..." />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="links">Links adicionais (um por linha)</Label>
              <Textarea id="links" name="links" placeholder="https://site-1\nhttps://site-2" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Capa do Curso (imagem)</Label>
              <div className="mt-2">
                <CoverUploader hiddenInputName="cover_uploaded_url" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Anexos (até 3 arquivos)</Label>
              <Input name="file1" type="file" />
              <Input name="file2" type="file" />
              <Input name="file3" type="file" />
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