import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import CourseContent from "@/components/course-content"
import { getCoursePresetContentByTitle } from "@/lib/course-presets"
import CourseProgressLive from "@/components/course-progress-live"
import CourseProgressNumberLive from "@/components/course-progress-number-live"
import BackButton from "@/components/back-button"

export default async function CourseDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = await createClient()

  // Get user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get course details
  const { data: foundCourse, error } = await supabase.from("courses").select("*").eq("id", params.id).single()

  if (error || !foundCourse) {
    notFound()
  }

  // Get user progress if logged in
  let userProgress = null as any
  let role: string | null = null
  if (user) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", foundCourse.id)
      .single()
    userProgress = progress

    const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    role = me?.role || null
  }

  const categoryLabels = {
    history: "História",
    politics: "Política",
    economics: "Economia",
    social: "Social",
    campaign: "Campanha",
  }

  const categoryColors = {
    history: "bg-amber-100 text-amber-800",
    politics: "bg-blue-100 text-blue-800",
    economics: "bg-green-100 text-green-800",
    social: "bg-purple-100 text-purple-800",
    campaign: "bg-red-100 text-red-800",
  }

  const difficultyLabels = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  }

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  }

  // Load quiz questions (publicly readable per policy)
  const { data: quiz } = await supabase
    .from("course_quiz_questions")
    .select("id, question_text, option_a, option_b, option_c, option_d, correct_option, sort_order")
    .eq("course_id", foundCourse.id)
    .order("sort_order", { ascending: true })

  // Apply preset dynamic content if course has empty content and matches preset
  const presetText = getCoursePresetContentByTitle(foundCourse.title || "")
  const course = presetText && (!foundCourse.content || String(foundCourse.content || "").trim().length === 0)
    ? { ...foundCourse, content: presetText }
    : foundCourse

  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-8">
      <div className="mb-3 sm:mb-4 md:mb-6"><BackButton /></div>

      {/* Mobile: Sidebar first, then main content */}
      <div className="block lg:hidden space-y-4 sm:space-y-6">
        {/* Course Info Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">Informações do Curso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Duração</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">{course.duration_minutes} minutos</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Pontos</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">{course.points_reward} pontos ao concluir</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Categoria</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {categoryLabels[course.category as keyof typeof categoryLabels]}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 text-sm sm:text-base">Nível</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Library Card */}
        {user && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg sm:text-xl">Biblioteca Digital</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Acesse materiais complementares e cartilhas relacionadas a este curso.
              </p>
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
                <Link href="/library">Ver Biblioteca</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Course Content */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className={`text-xs sm:text-sm ${categoryColors[course.category as keyof typeof categoryColors]}`}>
                  {categoryLabels[course.category as keyof typeof categoryLabels]}
                </Badge>
                <Badge className={`text-xs sm:text-sm ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
                  {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                </Badge>
                {userProgress?.completed && (
                  <Badge className="bg-green-100 text-green-800 text-xs sm:text-sm">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Concluído
                  </Badge>
                )}
              </div>
              {role && ["admin", "coordinator"].includes(role) && (
                <Button asChild className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm w-full sm:w-auto">
                  <Link href={`/courses/${params.id}/edit`}>Editar</Link>
                </Button>
              )}
            </div>

            <CardTitle className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 leading-tight">{course.title}</CardTitle>

            {userProgress && !userProgress.completed && (
              <div className="mb-3 sm:mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <span>Seu progresso</span>
                  <CourseProgressNumberLive courseId={course.id} initialPercentage={userProgress.progress_percentage} />
                </div>
                <CourseProgressLive courseId={course.id} initialPercentage={userProgress.progress_percentage} />
              </div>
            )}

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">{course.description}</p>
          </CardHeader>
        </Card>

        {/* Course Content Component */}
        <CourseContent course={course} user={user} userProgress={userProgress} quizQuestions={quiz || []} canManage={role ? ["admin","coordinator"].includes(role) : false} />
      </div>

      {/* Desktop: Sidebar layout */}
      <div className="hidden lg:grid lg:grid-cols-4 gap-6 md:gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge className={categoryColors[course.category as keyof typeof categoryColors]}>
                    {categoryLabels[course.category as keyof typeof categoryLabels]}
                  </Badge>
                  <Badge className={difficultyColors[course.difficulty as keyof typeof difficultyColors]}>
                    {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                  </Badge>
                  {userProgress?.completed && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Concluído
                    </Badge>
                  )}
                </div>
                {role && ["admin", "coordinator"].includes(role) && (
                  <Button asChild className="bg-red-600 hover:bg-red-700">
                    <Link href={`/courses/${params.id}/edit`}>Editar</Link>
                  </Button>
                )}
              </div>

              <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>

              {userProgress && !userProgress.completed && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Seu progresso</span>
                    <CourseProgressNumberLive courseId={course.id} initialPercentage={userProgress.progress_percentage} />
                  </div>
                  <CourseProgressLive courseId={course.id} initialPercentage={userProgress.progress_percentage} />
                </div>
              )}

              <p className="text-lg text-muted-foreground leading-relaxed">{course.description}</p>
            </CardHeader>
          </Card>

          <div className="mt-8">
            <CourseContent course={course} user={user} userProgress={userProgress} quizQuestions={quiz || []} canManage={role ? ["admin","coordinator"].includes(role) : false} />
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-1">Duração</h4>
                <p className="text-sm text-muted-foreground">{course.duration_minutes} minutos</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Pontos</h4>
                <p className="text-sm text-muted-foreground">{course.points_reward} pontos ao concluir</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Categoria</h4>
                <p className="text-sm text-muted-foreground">
                  {categoryLabels[course.category as keyof typeof categoryLabels]}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Nível</h4>
                <p className="text-sm text-muted-foreground">
                  {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                </p>
              </div>
            </CardContent>
          </Card>

          {user && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Biblioteca Digital</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Acesse materiais complementares e cartilhas relacionadas a este curso.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/library">Ver Biblioteca</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
