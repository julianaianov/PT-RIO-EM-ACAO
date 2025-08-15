import { createClient } from "@/lib/supabase/server"
import NucleosList from "@/components/nucleos-list"
import NucleosMap from "@/components/nucleos-map"
import NucleosFilters from "@/components/nucleos-filters"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  city?: string
  neighborhood?: string
  search?: string
}

export default async function NucleosPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Get user to check permissions
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    userProfile = profile
  }

  // Build query with filters
  let query = supabase.from("nucleos").select("*").eq("active", true).order("name", { ascending: true })

  if (searchParams.city) {
    query = query.eq("city", searchParams.city)
  }
  if (searchParams.neighborhood) {
    query = query.eq("neighborhood", searchParams.neighborhood)
  }
  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: nucleos, error } = await query

  if (error) {
    console.error("Error fetching nucleos:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Mapa de Núcleos</h1>
          <p className="text-muted-foreground">Encontre o núcleo do PT mais próximo de você</p>
        </div>

        {userProfile?.role === "coordinator" || userProfile?.role === "admin" ? (
          <Button asChild>
            <Link href="/nucleos/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Núcleo
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <NucleosFilters />
        </div>
        <div className="lg:col-span-3">
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Lista</TabsTrigger>
              <TabsTrigger value="map">Mapa</TabsTrigger>
            </TabsList>
            <TabsContent value="list" className="mt-6">
              <NucleosList nucleos={nucleos || []} />
            </TabsContent>
            <TabsContent value="map" className="mt-6">
              <NucleosMap nucleos={nucleos || []} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
