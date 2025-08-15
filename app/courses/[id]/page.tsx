import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import CourseContent from "@/components/course-content"

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
  const { data: course, error } = await supabase.from("courses").select("*").eq("id", params.id).single()

  if (error || !course) {
    notFound()
  }

  // Get user progress if logged in
  let userProgress = null
  if (user) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single()
    userProgress = progress
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/courses">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Cursos
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
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
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {course.duration_minutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {course.points_reward} pts
                  </div>
                </div>
              </div>

              <CardTitle className="text-3xl mb-4">{course.title}</CardTitle>

              {userProgress && !userProgress.completed && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Seu progresso</span>
                    <span>{userProgress.progress_percentage}%</span>
                  </div>
                  <Progress value={userProgress.progress_percentage} />
                </div>
              )}

              <p className="text-lg text-muted-foreground leading-relaxed">{course.description}</p>
            </CardHeader>
          </Card>

          <div className="mt-8">
            <CourseContent course={course} user={user} userProgress={userProgress} />
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
