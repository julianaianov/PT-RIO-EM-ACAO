import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Users, BookOpen, Target } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export async function YouthMentorship() {
  const supabase = await createClient()
  const { data: mentorshipPrograms } = await supabase
    .from("youth_mentorships")
    .select("id, title, description, duration, mentors, mentees, next_cohort, level")
    .order("title")

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      Iniciante: "bg-green-100 text-green-800",
      Intermediário: "bg-yellow-100 text-yellow-800",
      Avançado: "bg-red-100 text-red-800",
    }
    return colors[level] || "bg-gray-100 text-gray-800"
  }

  return (
    <Card className="border-red-200">
      <CardHeader className="bg-gradient-to-r from-red-100 to-red-200">
        <CardTitle className="text-red-800 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Programa de Mentoria
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {(mentorshipPrograms || []).map((program, index) => (
            <div key={index} className="p-4 border border-red-200 rounded-lg bg-white">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">{program.title}</h3>
                <Badge className={getLevelColor((program as any).level)}>{(program as any).level}</Badge>
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
                <div className="text-red-600 font-medium">Início: {program.next_cohort}</div>
              </div>

              <Button asChild size="sm" variant="outline" className="w-full bg-transparent text-xs hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 hover:text-white hover:border-transparent">
                <Link href={`/youth/mentorships/${(program as any).id}`}>Candidatar-se</Link>
              </Button>
            </div>
          ))}
          {(!mentorshipPrograms || mentorshipPrograms.length === 0) && (
            <div className="text-sm text-gray-600">Nenhum programa disponível.</div>
          )}
        </div>

        <div className="mt-4 p-3 bg-red-50 rounded-lg">
          <h4 className="font-semibold text-red-800 text-sm mb-1">Quer ser Mentor?</h4>
          <p className="text-xs text-gray-600 mb-2">
            Compartilhe sua experiência e ajude a formar novas lideranças jovens.
          </p>
          <Button asChild size="sm" className="bg-red-600 hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 text-xs">
            <Link href="/youth/mentorships/mentor">Inscrever-se como Mentor</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
