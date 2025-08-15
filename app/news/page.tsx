import { createClient } from "@/lib/supabase/server"
import NewsList from "@/components/news-list"
import NewsFilters from "@/components/news-filters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface SearchParams {
  category?: string
  region?: string
  search?: string
}

export default async function NewsPage({
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
  let query = supabase
    .from("news")
    .select(`
      *,
      profiles!news_created_by_fkey(full_name)
    `)
    .eq("published", true)
    .order("published_at", { ascending: false })

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }
  if (searchParams.region) {
    query = query.eq("target_region", searchParams.region)
  }
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,content.ilike.%${searchParams.search}%`)
  }

  const { data: news, error } = await query

  if (error) {
    console.error("Error fetching news:", error)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Notícias e Comunicação</h1>
          <p className="text-muted-foreground">Fique por dentro das últimas novidades do PT RJ</p>
        </div>

        {userProfile?.role === "coordinator" || userProfile?.role === "admin" ? (
          <Button asChild>
            <Link href="/news/create">
              <Plus className="h-4 w-4 mr-2" />
              Nova Publicação
            </Link>
          </Button>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <NewsFilters />
        </div>
        <div className="lg:col-span-3">
          <NewsList news={news || []} />
        </div>
      </div>
    </div>
  )
}
