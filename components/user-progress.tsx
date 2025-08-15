import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Star, Target } from "lucide-react"

interface UserProgressProps {
  userProfile: any
  userProgress: any[]
}

const MILITANT_LEVELS = [
  { name: "Militante Iniciante", icon: "🌱", minPoints: 0, maxPoints: 99, title: "Base Ativa" },
  { name: "Mobilizador de Bairro", icon: "🌿", minPoints: 100, maxPoints: 249, title: "Mobilizador" },
  { name: "Formador Popular", icon: "🌳", minPoints: 250, maxPoints: 499, title: "Formador" },
  { name: "Referência de Base", icon: "🔥", minPoints: 500, maxPoints: 999, title: "Líder Local" },
  { name: "Militante do Ano", icon: "⭐", minPoints: 1000, maxPoints: 9999, title: "Companheiro Destaque" },
]

export default function UserProgress({ userProfile, userProgress }: UserProgressProps) {
  const completedCourses = userProgress?.filter((p) => p.completed).length || 0
  const totalCourses = userProgress?.length || 0
  const totalPoints = userProfile?.points || 0

  const getCurrentLevel = (points: number) => {
    return MILITANT_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints) || MILITANT_LEVELS[0]
  }

  const getNextLevel = (points: number) => {
    const currentLevelIndex = MILITANT_LEVELS.findIndex(
      (level) => points >= level.minPoints && points <= level.maxPoints,
    )
    return currentLevelIndex < MILITANT_LEVELS.length - 1 ? MILITANT_LEVELS[currentLevelIndex + 1] : null
  }

  const currentLevel = getCurrentLevel(totalPoints)
  const nextLevel = getNextLevel(totalPoints)
  const progressToNext = nextLevel
    ? ((totalPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Seu Progresso</h2>
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              Pontos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPoints}</div>
            <Badge className="bg-red-100 text-red-800">
              {currentLevel.icon} {currentLevel.title}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              Cursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCourses}</div>
            <p className="text-sm text-muted-foreground">de {totalCourses} iniciados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="h-4 w-4 text-orange-500" />
              Taxa de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%
            </div>
            <Progress value={totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              Próxima Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {nextLevel ? (
                <span>
                  {nextLevel.icon} {nextLevel.title} ({nextLevel.minPoints} pts)
                </span>
              ) : (
                <span>🎉 Nível máximo alcançado!</span>
              )}
            </div>
            {nextLevel && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{totalPoints} pts</span>
                  <span>{nextLevel.minPoints} pts</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
                <p className="text-xs text-muted-foreground">{nextLevel.minPoints - totalPoints} pontos restantes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
