import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import QuickMenu from "@/components/quick-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Newspaper, Users, Award, Radio } from "lucide-react"
import Link from "next/link"

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
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header removido para evitar duplicidade com a barra de menu */}

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Plataforma Digital PT RJ EM AÇÃO
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Acesse notícias, eventos, formação política e muito mais para fortalecer 
            nossa luta por uma sociedade mais justa e igualitária.
          </p>
        </div>

        {/* Banner */}
        <div className="mb-6 md:mb-8">
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-red-600">
            <img src="/lula.png" alt="Banner Lula" className="w-full h-40 sm:h-56 md:h-80 object-contain object-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/10 to-transparent" />
          </div>
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

        {/* Portais Governamentais */}
        <div className="mt-8">
          <Card className="border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white" />
                Portais Governamentais para o Cidadão
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 bg-white/70">
              <div>
                <h3 className="font-semibold mb-2 text-red-800">Portais Federais</h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Gov.br</span> – Serviços e informações do Governo Federal em um único lugar.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Acesso.gov.br</span> – Login unificado com CPF para diversos serviços.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://acesso.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Portal da Transparência</span> – Gastos, contratos e recursos públicos.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://portaldatransparencia.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Dados Abertos (dados.gov.br)</span> – Bases de dados públicas.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://dados.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Agência Gov (EBC)</span> – Notícias e coberturas do Governo Federal.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://agenciagov.ebc.com.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Meu SUS Digital</span> – Histórico de saúde do cidadão (vacinas, exames, etc.).
                  </li>
                  <li>
                    <span className="font-medium">Portal Cidadão (Caixa)</span> – Benefícios e serviços sociais.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://cidadao.caixa.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-red-800">Portais Estaduais do RJ</h3>
                <ul className="list-disc ml-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Portal do Governo do Estado do Rio de Janeiro</span> – notícias, serviços, transparência e acesso à informação.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.rj.gov.br/" target="_blank" rel="noopener noreferrer">rj.gov.br</a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.rj.gov.br/cidadao/servicos" target="_blank" rel="noopener noreferrer">Serviços ao Cidadão</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">e-SIC (Serviço de Informação ao Cidadão)</span> – solicitações pela LAI.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.rj.gov.br/servico/acessar-servico-de-informacao-ao-cidadao-1244" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Tribunal de Justiça do RJ – Portal Cidadão</span> – consultas processuais, pautas, débitos e conciliação.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.tjrj.jus.br/cidadao" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Defensoria Pública do RJ</span> – assistência jurídica gratuita.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.defensoria.rj.def.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                  <li>
                    <span className="font-medium">Detran-RJ</span> – CNH, identificação civil, veículos e infrações.
                    <Button asChild variant="outline" size="sm" className="ml-2">
                      <a href="https://www.detran.rj.gov.br/" target="_blank" rel="noopener noreferrer">Acessar</a>
                    </Button>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-red-800">Resumo dos Principais Portais (RJ)</h3>
                <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
                  <div className="font-medium">Governo do Estado – Serviços</div>
                  <div>Centraliza serviços estaduais (benefícios, programas sociais, transparência).</div>
                  <div className="font-medium">e-SIC (LAI)</div>
                  <div>Solicitar acesso a documentos e informações públicas.</div>
                  <div className="font-medium">TJRJ – Portal Cidadão</div>
                  <div>Processos, débitos, pautas e conciliação.</div>
                  <div className="font-medium">Defensoria Pública</div>
                  <div>Atendimento jurídico gratuito.</div>
                  <div className="font-medium">Detran-RJ</div>
                  <div>CNH, identificação civil, veículos e infrações.</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-red-800">PT – Diretórios Estaduais</h3>
                <Button asChild variant="outline" size="sm">
                  <a href="https://pt.org.br/diretorios-estaduais/" target="_blank" rel="noopener noreferrer">pt.org.br/diretorios-estaduais</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
       
      </div>
    </div>
  )
} 