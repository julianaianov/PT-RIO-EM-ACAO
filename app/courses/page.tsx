import { createClient } from "@/lib/supabase/server"
import CoursesList from "@/components/courses-list"
import CoursesFilters from "@/components/courses-filters"
import UserProgress from "@/components/user-progress"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

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
    const { data: profile } = await supabase.from("profiles").select("role, points").eq("id", user.id).single()
    userProfile = profile

    const { data: progress } = await supabase.from("course_progress").select("*, courses(title)").eq("user_id", user.id)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Formação Política</h1>
          <p className="text-muted-foreground">Desenvolva seus conhecimentos políticos e sociais</p>
        </div>

        {userProfile?.role === "coordinator" || userProfile?.role === "admin" ? (
          <Button asChild>
            <Link href="/courses/create">
              <Plus className="h-4 w-4 mr-2" />
              Novo Curso
            </Link>
          </Button>
        ) : null}
      </div>

      {user && <UserProgress userProfile={userProfile} userProgress={userProgress} />}

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CoursesFilters />
        </div>
        <div className="lg:col-span-3">
          <CoursesList courses={courses || []} userProgress={userProgress} />
        </div>
      </div>
    </div>
  )
}
