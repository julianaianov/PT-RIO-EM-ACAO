import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, Play, BookOpen, CheckCircle, FileText, Image as ImageIcon } from "lucide-react"
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
  // Optional hydrated fields from attachments
  cover_url?: string | null
  pdfs?: { file_url: string; title?: string }[]
}

interface CoursesListProps {
  courses: Course[]
  userProgress: any[] | null
  canManage?: boolean
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

export default function CoursesList({ courses, userProgress, canManage }: CoursesListProps) {
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
          <Card key={course.id} className="hover:shadow-lg transition-shadow border-red-200 overflow-hidden">
            {/* Cover */}
            <div className="relative h-40 sm:h-44 md:h-56 bg-muted">
              {course.cover_url ? (
                <img src={course.cover_url} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <img src="/CIDADANIA.jpg" alt={course.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute top-3 left-3">
                <Badge className={categoryColors[course.category as keyof typeof categoryColors]}>
                  {categoryLabels[course.category as keyof typeof categoryLabels]}
                </Badge>
              </div>
              {isCompleted && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" /> Concluído
                  </Badge>
                </div>
              )}
            </div>

            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg sm:text-xl text-red-800 leading-snug">{course.title}</CardTitle>
                <Badge className={difficultyColors[course.difficulty as keyof typeof difficultyColors]}>
                  {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration_minutes} min
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {course.points_reward} pts
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm sm:text-base leading-relaxed">{course.description}</p>

              {/* PDF Attachments quick actions */}
              {course.pdfs && course.pdfs.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.pdfs.map((p, idx) => (
                    <a key={idx} href={p.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm px-2 py-1 border rounded hover:bg-red-50">
                      <FileText className="h-4 w-4 text-red-600" /> Ver/baixar PDF
                    </a>
                  ))}
                </div>
              )}

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

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
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

                {canManage && (
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/courses/${course.id}/edit`}>Editar</Link>
                  </Button>
                )}

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
