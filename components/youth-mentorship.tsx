import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Users, BookOpen, Target } from "lucide-react"

export function YouthMentorship() {
  const mentorshipPrograms = [
    {
      title: "Liderança Política",
      description: "Desenvolvimento de habilidades de liderança e gestão pública",
      duration: "6 meses",
      mentors: 8,
      mentees: 24,
      nextCohort: "Março 2024",
      level: "Intermediário",
    },
    {
      title: "Comunicação e Mídia",
      description: "Estratégias de comunicação política e uso de redes sociais",
      duration: "4 meses",
      mentors: 5,
      mentees: 15,
      nextCohort: "Fevereiro 2024",
      level: "Iniciante",
    },
    {
      title: "Organização Comunitária",
      description: "Técnicas de mobilização e organização de base",
      duration: "8 meses",
      mentors: 6,
      mentees: 18,
      nextCohort: "Abril 2024",
      level: "Avançado",
    },
  ]

  const getLevelColor = (level: string) => {
    const colors = {
      Iniciante: "bg-green-100 text-green-800",
      Intermediário: "bg-yellow-100 text-yellow-800",
      Avançado: "bg-red-100 text-red-800",
    }
    return colors[level as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
        <CardTitle className="text-orange-800 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Programa de Mentoria
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {mentorshipPrograms.map((program, index) => (
            <div key={index} className="p-4 border border-orange-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">{program.title}</h3>
                <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
              </div>

              <p className="text-xs text-gray-600 mb-3">{program.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                <div className="flex items-center gap-1 text-gray-600">
                  <BookOpen className="h-3 w-3" />
                  {program.duration}
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Users className="h-3 w-3" />
                  {program.mentors} mentores
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Target className="h-3 w-3" />
                  {program.mentees} vagas
                </div>
                <div className="text-orange-600 font-medium">Início: {program.nextCohort}</div>
              </div>

              <Button size="sm" variant="outline" className="w-full bg-transparent text-xs">
                Candidatar-se
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <h4 className="font-semibold text-orange-800 text-sm mb-1">Quer ser Mentor?</h4>
          <p className="text-xs text-gray-600 mb-2">
            Compartilhe sua experiência e ajude a formar novas lideranças jovens.
          </p>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs">
            Inscrever-se como Mentor
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
