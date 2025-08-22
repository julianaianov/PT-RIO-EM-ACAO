import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"
import NucleosMap from "@/components/nucleos-map"

export default async function NucleosRJPage() {
  const supabase = await createClient()

  const { data: nucleos } = await supabase
    .from("nucleos")
    .select(
      "id, name, description, city, neighborhood, address, contact_name, contact_phone, contact_email, whatsapp_link, telegram_link, latitude, longitude, active"
    )
    .eq("active", true)
    .order("name", { ascending: true })

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner RJ personalizado */}
      <div className="rounded-2xl overflow-hidden mb-8 border border-red-200">
        <div
          className="text-white py-8 px-6 md:px-10 flex items-center gap-4"
          style={{
            background:
              "linear-gradient(135deg, #c81e1e 0%, #ef4444 50%, #dc2626 100%)",
          }}
        >
          <img src="/start.png" alt="PT RJ" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/60" />
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Rio De Janeiro</h1>
            <p className="text-white/90">Núcleos do PT RJ – participação popular e organização territorial</p>
          </div>
        </div>
      </div>

      {/* Acesso rápido */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant="outline" className="border-red-200 text-red-800">RJ</Badge>
        <Button asChild size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
          <Link href="/nucleos?city=Rio%20de%20Janeiro">Rio de Janeiro</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
          <Link href="/nucleos?city=Niter%C3%B3i">Niterói</Link>
        </Button>
        <Button asChild size="sm" variant="outline" className="border-red-200 hover:bg-red-50">
          <Link href="/nucleos?region=Baixada">Baixada Fluminense</Link>
        </Button>
      </div>

      {/* Contato + mapa */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800">Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-1">PT Rio De Janeiro</h3>
              <p className="text-sm text-muted-foreground">Partido dos Trabalhadores – Rio de Janeiro</p>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-red-600" /> R. Sete de Setembro, 164 – Centro, Rio de Janeiro – RJ, 20060-010
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600" /> (21) 2018-7063
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Diretório Nacional do PT</h3>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-red-600" /> Rua Silveira Martins, 132 – São Paulo – SP, 01019-000
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4 text-red-600" /> (11) 3243–1301
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-1">Sede Nacional do PT em Brasília</h3>
              <p className="text-sm flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-red-600" /> Setor Comercial Sul – Quadra 2, Bloco C, Nº 256, Edifício Toufic – Brasília – DF
              </p>
            </div>

            <div className="pt-2">
              <Button asChild variant="outline" size="sm" className="border-red-200 hover:bg-red-50">
                <a href="https://pt.org.br/diretorios-estaduais/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" /> Diretórios Estaduais do PT
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Mapa dos Núcleos no RJ */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800">Mapa dos Núcleos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <NucleosMap nucleos={nucleos || []} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Endereços */}
      <div className="mt-8">
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-800">Endereços dos Núcleos no RJ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {(nucleos || []).map((n) => (
                <div key={n.id} className="border rounded-md p-3">
                  <div className="font-semibold">{n.name}</div>
                  <div className="text-sm text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>
                      {n.address || "Endereço não informado"}
                      {n.neighborhood ? `, ${n.neighborhood}` : ""}
                      {n.city ? ` – ${n.city}` : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 