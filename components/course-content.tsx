"use client"

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Play } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface CourseContentProps {
  course: any
  user: any
  userProgress: any
}

export default function CourseContent({ course, user, userProgress }: CourseContentProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const markAsCompleted = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar seu progresso",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Update or insert progress
      const { error: progressError } = await supabase.from("course_progress").upsert({
        user_id: user.id,
        course_id: course.id,
        completed: true,
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
      })

      if (progressError) throw progressError

      // Update user points
      const { error: pointsError } = await supabase.rpc("update_user_points", {
        user_id: user.id,
        points_to_add: course.points_reward,
      })

      if (pointsError) throw pointsError

      toast({
        title: "Parabéns!",
        description: `Curso concluído! Você ganhou ${course.points_reward} pontos.`,
      })

      router.refresh()
    } catch (error) {
      console.error("Error completing course:", error)
      toast({
        title: "Erro",
        description: "Não foi possível marcar o curso como concluído",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateProgress = async (percentage: number) => {
    if (!user) return

    try {
      await supabase.from("course_progress").upsert({
        user_id: user.id,
        course_id: course.id,
        progress_percentage: percentage,
        completed: percentage >= 100,
        completed_at: percentage >= 100 ? new Date().toISOString() : null,
      })

      if (percentage >= 100) {
        await supabase.rpc("update_user_points", {
          user_id: user.id,
          points_to_add: course.points_reward,
        })
      }

      router.refresh()
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Video Content */}
      {course.video_url && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Vídeo do Curso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <video controls className="w-full h-full rounded-lg">
                <source src={course.video_url} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Text Content */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="text-lg leading-relaxed whitespace-pre-wrap">{course.content}</div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Section (Mock) */}
      <Card>
        <CardHeader>
          <CardTitle>Quiz de Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Qual é o principal objetivo do PT?</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q1" value="a" />
                  <span>Defender os interesses dos trabalhadores</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q1" value="b" />
                  <span>Promover o capitalismo</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q1" value="c" />
                  <span>Manter o status quo</span>
                </label>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">2. Em que ano foi fundado o PT?</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q2" value="a" />
                  <span>1980</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q2" value="b" />
                  <span>1982</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="q2" value="c" />
                  <span>1985</span>
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Section */}
      {user && (
        <Card>
          <CardContent className="pt-6">
            {userProgress?.completed ? (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Curso Concluído!</h3>
                <p className="text-muted-foreground mb-4">
                  Você ganhou {course.points_reward} pontos por concluir este curso.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/courses">Ver Outros Cursos</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Concluir Curso</h3>
                <p className="text-muted-foreground mb-4">
                  Marque como concluído para ganhar {course.points_reward} pontos!
                </p>
                <Button onClick={markAsCompleted} disabled={loading}>
                  {loading ? "Salvando..." : "Marcar como Concluído"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
