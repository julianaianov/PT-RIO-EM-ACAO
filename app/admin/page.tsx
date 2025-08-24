import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Users, Calendar, Newspaper, BookOpen, MapPin, Radio, Zap, Trophy, Share2 } from "lucide-react"
import BackButton from "@/components/back-button"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")

  const { data: me } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()
  if (me?.role !== "admin") redirect("/?error=Acesso restrito ao admin")

  const cards = [
    { title: "Usuários", href: "/admin/users", icon: Users, desc: "Gerencie papéis e acessos" },
    { title: "Agenda", href: "/events", icon: Calendar, desc: "Criar/editar eventos" },
    { title: "Notícias", href: "/news", icon: Newspaper, desc: "Criar/editar publicações" },
    { title: "Formação", href: "/courses", icon: BookOpen, desc: "Gerir cursos e conteúdos" },
    { title: "Núcleos", href: "/nucleos", icon: MapPin, desc: "Gerir núcleos" },
    { title: "Rádio PT", href: "/radio", icon: Radio, desc: "Programas e podcasts" },
    { title: "Movimentos", href: "/movements", icon: Users, desc: "Ações e movimentos" },
    { title: "Juventude", href: "/admin/youth", icon: Zap, desc: "Conteúdos da juventude" },
    { title: "Pontos", href: "/points", icon: Trophy, desc: "Sistema de pontos" },
    { title: "Compartilhar", href: "/admin/share-links", icon: Share2, desc: "Gestão de links de compartilhamento" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-white"><BackButton fallback="/" /></div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Painel do Admin</h1>
        <p className="text-white/90">Bem-vindo{me?.full_name ? `, ${me.full_name}` : ""}. Selecione uma área para gerenciar.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map(({ title, href, icon: Icon, desc }) => (
          <Card key={title} className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <Icon className="h-5 w-5 text-red-600" /> {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-muted-foreground">{desc}</p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href={href}>Abrir</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 