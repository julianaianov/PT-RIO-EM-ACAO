import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import QuickMenu from "@/components/quick-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Newspaper, Users, TrendingUp, Award, Radio, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/lib/actions"

export default async function HomePage() {
  const supabase = await createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile (only if Supabase is configured)
  let profile = null as any
  let newsCount = 0
  let eventsCount = 0
  let coursesCount = 0

  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", user.id)
      .single()
    profile = profileData

    const { data: newsData } = await supabase
      .from("news")
      .select("id", { count: "exact" })
      .eq("published", true)
    newsCount = newsData?.length || 0

    const { data: eventsData } = await supabase
      .from("events")
      .select("id", { count: "exact" })
      .gte("event_date", new Date().toISOString())
    eventsCount = eventsData?.length || 0

    const { data: coursesData } = await supabase
      .from("courses")
      .select("id", { count: "exact" })
      .eq("active", true)
    coursesCount = coursesData?.length || 0
  } catch (error) {
    console.log("Supabase query error", error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">PT</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-red-800">PT RJ</h1>
              <p className="text-gray-600">Bem-vindo, {profile?.full_name || user.email}</p>
            </div>
          </div>
          
          <form action={signOut}>
            <Button variant="outline" type="submit" className="border-red-600 text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </form>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Plataforma Digital do PT RJ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acesse notícias, eventos, formação política e muito mais para fortalecer 
            nossa luta por uma sociedade mais justa e igualitária.
          </p>
        </div>

        {/* Quick Menu */}
        <QuickMenu />

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">Notícias</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {newsCount}
              </div>
              <p className="text-sm text-gray-600">Publicações ativas</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">Eventos</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {eventsCount}
              </div>
              <p className="text-sm text-gray-600">Próximos eventos</p>
            </CardContent>
          </Card>

          <Card className="border-red-200 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-red-600" />
                <CardTitle className="text-lg">Formação</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600 mb-2">
                {coursesCount}
              </div>
              <p className="text-sm text-gray-600">Cursos disponíveis</p>
            </CardContent>
          </Card>
        </div>

        {/* Featured Sections */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-red-600" />
                Rádio PT RJ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ouça a voz da transformação social. Programas, debates e notícias em tempo real.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/radio">Ouvir Agora</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                Juventude PT RJ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Espaço dedicado à juventude. Eventos, formação e ações específicas para jovens militantes.
              </p>
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/youth">Participar</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-500">
          <p className="text-sm">
            © 2024 Partido dos Trabalhadores - Rio de Janeiro. 
            Construindo uma sociedade mais justa e igualitária.
          </p>
        </div>
      </div>
    </div>
  )
} 