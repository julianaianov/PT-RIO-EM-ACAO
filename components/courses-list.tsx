import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, Play, BookOpen, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Course {
  id: string
  title: string
  description: string
  duration_minutes: number
  points_reward: number
  difficulty: string
  category: string
  video_url: string | null
}

interface CoursesListProps {
  courses: Course[]
  userProgress: any[] | null
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

export default function CoursesList({ courses, userProgress }: CoursesListProps) {
  const getUserProgress = (courseId: string) => {
    return userProgress?.find((p) => p.course_id === courseId)
  }

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
          <p className="text-muted-foreground">Não há cursos que correspondam aos filtros selecionados.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {courses.map((course) => {
        const progress = getUserProgress(course.id)
        const isCompleted = progress?.completed
        const progressPercentage = progress?.progress_percentage || 0

        return (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={categoryColors[course.category as keyof typeof categoryColors]}>
                    {categoryLabels[course.category as keyof typeof categoryLabels]}
                  </Badge>
                  <Badge className={difficultyColors[course.difficulty as keyof typeof difficultyColors]}>
                    {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                  </Badge>
                  {isCompleted && (
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
              <CardTitle className="text-xl">{course.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{course.description}</p>

              {/* Progress Bar */}
              {progress && !isCompleted && (
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button asChild>
                  <Link href={`/courses/${course.id}`}>
                    {course.video_url ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        {isCompleted ? "Revisar" : progress ? "Continuar" : "Iniciar"} Curso
                      </>
                    ) : (
                      <>
                        <BookOpen className="h-4 w-4 mr-2" />
                        {isCompleted ? "Revisar" : progress ? "Continuar" : "Ler"} Material
                      </>
                    )}
                  </Link>
                </Button>

                {progress && (
                  <div className="text-sm text-muted-foreground">
                    {isCompleted ? "Concluído" : `${progressPercentage}% concluído`}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
