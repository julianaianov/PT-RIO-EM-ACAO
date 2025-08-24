import { createClient } from "@/lib/supabase/server"
import CoursesList from "@/components/courses-list"
import CoursesFilters from "@/components/courses-filters"
import UserProgress from "@/components/user-progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import BackButton from "@/components/back-button"

interface SearchParams {
  category?: string
  difficulty?: string
  search?: string
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const supabase = await createClient()

  // Get user to check permissions and progress
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile = null
  let userProgress: any[] = []

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single()
    userProfile = profile

    const { data: progress } = await supabase
      .from("course_progress")
      .select("*, courses(title)")
      .eq("user_id", user.id)

    userProgress = progress || []
  }

  // Build query with filters
  let query = supabase.from("courses").select("*").eq("active", true).order("created_at", { ascending: false })

  if (searchParams.category) {
    query = query.eq("category", searchParams.category)
  }
  if (searchParams.difficulty) {
    query = query.eq("difficulty", searchParams.difficulty)
  }
  if (searchParams.search) {
    query = query.or(`title.ilike.%${searchParams.search}%,description.ilike.%${searchParams.search}%`)
  }

  const { data: courses, error } = await query

  if (error) {
    console.error("Error fetching courses:", error)
  }

  // Hydrate with attachments (cover image and pdfs)
  const ids = (courses || []).map((c: any) => c.id)
  let attachments: any[] = []
  if (ids.length > 0) {
    const { data: att } = await supabase
      .from("course_attachments")
      .select("course_id,file_url,mime_type,title,is_cover")
      .in("course_id", ids)
    attachments = att || []
  }

  const decorated = (courses || []).map((c: any) => {
    const att = attachments.filter((a) => a.course_id === c.id)
    const coverMarked = att.find((a) => a.is_cover === true)
    const coverFallback = att.find((a) => (a.mime_type || "").startsWith("image/") || (a.file_url || "").match(/\.(png|jpe?g|gif|webp)$/i))
    const cover = coverMarked || coverFallback
    const pdfs = att
      .filter((a) => (a.mime_type || "").includes("pdf") || (a.file_url || "").toLowerCase().endsWith(".pdf"))
      .map((a) => ({ file_url: a.file_url as string, title: a.title as string | undefined }))
    return { ...c, cover_url: cover?.file_url || null, pdfs }
  })

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-8 min-h-screen">
      <div className="mb-3 sm:mb-4 md:mb-6"><BackButton /></div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 md:mb-6 lg:mb-8 gap-2 sm:gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2">Formação Política</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Desenvolva seus conhecimentos políticos e sociais</p>
        </div>

        {userProfile?.role === "coordinator" || userProfile?.role === "admin" ? (
          <Button asChild className="w-full sm:w-auto text-sm">
            <Link href="/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Link>
          </Button>
        ) : null}
      </div>

      {user && <UserProgress userProfile={userProfile} userProgress={userProgress} />}

      {/* Mobile: Filters first, then list */}
      <div className="block lg:hidden space-y-3 sm:space-y-4">
        <CoursesFilters />
        <CoursesList courses={decorated || []} userProgress={userProgress} canManage={userProfile?.role === "admin" || userProfile?.role === "coordinator"} />
      </div>

      {/* Desktop: Sidebar layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <CoursesFilters />
        </div>
        <div className="lg:col-span-3">
          <CoursesList courses={decorated || []} userProgress={userProgress} canManage={userProfile?.role === "admin" || userProfile?.role === "coordinator"} />
        </div>
      </div>
    </div>
  )
}
