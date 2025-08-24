"use client"

import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface CourseContentProps {
  course: any
  user: any
  userProgress: any
  quizQuestions?: any[]
  canManage?: boolean
}

export default function CourseContent({ course, user, userProgress, quizQuestions = [], canManage = false }: CourseContentProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Split content into navigable sections
  const sections: string[] = useMemo(() => {
    const text = String(course?.content || "").trim()
    if (!text) return []

    // Prefer splitting by module headings like "🔹 Módulo X — ..."
    const lines = text.split(/\r?\n/)
    const collected: string[] = []
    let buffer: string[] = []
    const isHeader = (s: string) => /^\s*🔹\s*M[óo]dulo\b/i.test(s)

    for (const line of lines) {
      if (isHeader(line)) {
        if (buffer.length > 0) collected.push(buffer.join("\n").trim())
        buffer = [line]
      } else {
        buffer.push(line)
      }
    }
    if (buffer.length > 0) collected.push(buffer.join("\n").trim())

    // Fallback: split by large paragraph breaks if no modules were detected
    const hasModules = collected.length > 1 || (collected[0] && isHeader(collected[0].split(/\n/)[0] || ""))
    if (!hasModules) {
      const byParagraphs = text
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean)
      return byParagraphs.length > 0 ? byParagraphs : [text]
    }
    return collected
  }, [course?.content])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const sectionTitles = useMemo(() => {
    return sections.map((s, idx) => {
      const firstLine = (s.split(/\n/)[0] || "").trim()
      const normalized = firstLine.replace(/^\s*🔹\s*/g, "").trim()
      return normalized.length > 0 ? normalized : `Parte ${idx + 1}`
    })
  }, [sections])

  // Initialize section index from saved progress
  const hasInitializedRef = useRef(false)
  useEffect(() => {
    if (hasInitializedRef.current) return
    if (!sections || sections.length === 0) return
    const pct = Number(userProgress?.progress_percentage || 0)
    const idx = userProgress?.completed
      ? sections.length - 1
      : Math.max(0, Math.min(sections.length - 1, Math.floor((pct / 100) * sections.length)))
    setCurrentIndex(idx)
    hasInitializedRef.current = true
  }, [sections, userProgress])

  // Persist progress when navigating
  useEffect(() => {
    if (!sections || sections.length === 0) return
    const pct = Math.round(((currentIndex + 1) / sections.length) * 100)
    updateProgress(pct)
    setExpanded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, string | undefined>>({})
  const [feedback, setFeedback] = useState<Record<string, "correct" | "wrong" | undefined>>({})
  const correctAnswers: Record<string, string> = { q1: "a", q2: "a" }

  const handleAnswer = (q: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [q]: value }))
    const isCorrect = value === correctAnswers[q]
    setFeedback((prev) => ({ ...prev, [q]: isCorrect ? "correct" : "wrong" }))
    toast({
      title: isCorrect ? "Correto!" : "Resposta incorreta",
      description: isCorrect ? "Boa! Continue." : "Tente novamente.",
      variant: isCorrect ? ("success" as any) : "destructive",
    })
  }

  const updateProgress = async (percentage: number) => {
    if (!user) return

    try {
      // Check if course is already completed to prevent multiple point awards
      const { data: existingProgress } = await supabase
        .from("course_progress")
        .select("completed, progress_percentage")
        .eq("user_id", user.id)
        .eq("course_id", course.id)
        .single()

      // If already completed, only update progress percentage, don't award points again
      const wasAlreadyCompleted = existingProgress?.completed || false
      const isCompletingNow = percentage >= 100 && !wasAlreadyCompleted

      await supabase
        .from("course_progress")
        .upsert(
          {
            user_id: user.id,
            course_id: course.id,
            progress_percentage: percentage,
            completed: percentage >= 100,
            completed_at: percentage >= 100 ? new Date().toISOString() : null,
          },
          { onConflict: "user_id,course_id" }
        )

      // Only award points if completing for the first time
      if (isCompletingNow) {
        try {
          await supabase.rpc("update_user_points", {
            user_id: user.id,
            points_to_add: course.points_reward,
          })
        } catch (error) {
          console.warn("Non-fatal: error updating user points:", error)
        }
      }

      // Inform live progress bars on the page
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("course-progress-updated", {
            detail: { courseId: course.id, percentage },
          })
        )
      }
    } catch (error) {
      console.error("Error updating progress:", error)
    }
  }

  const completeCurrentSection = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar seu progresso",
        variant: "destructive",
      })
      return
    }
    if (!sections || sections.length === 0) return

    // If last section, mark course as completed
    if (currentIndex >= sections.length - 1) {
      await markAsCompleted()
      return
    }

    const nextIndex = Math.min(sections.length - 1, currentIndex + 1)
    const nextPct = Math.round(((nextIndex + 1) / sections.length) * 100)
    await updateProgress(nextPct)
    setCurrentIndex(nextIndex)
  }

  const markAsCompleted = async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para salvar seu progresso",
        variant: "destructive",
      })
      return
    }

    // Check if already completed
    const { data: existingProgress } = await supabase
      .from("course_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .single()

    if (existingProgress?.completed) {
      toast({
        title: "Curso já concluído",
        description: "Este curso já foi concluído anteriormente.",
        variant: "default",
      })
      return
    }

    setLoading(true)

    try {
      // Update or insert progress
      const { error: progressError } = await supabase
        .from("course_progress")
        .upsert(
          {
        user_id: user.id,
        course_id: course.id,
        completed: true,
        progress_percentage: 100,
        completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,course_id" }
        )

      if (progressError) {
        console.error("Error updating progress to completed:", progressError)
        toast({ title: "Erro", description: "Falha ao salvar progresso", variant: "destructive" })
        return
      }

      // Update user points (only once)
      try {
      const { error: pointsError } = await supabase.rpc("update_user_points", {
        user_id: user.id,
        points_to_add: course.points_reward,
      })

        if (pointsError) {
          console.warn("Non-fatal: error updating user points:", pointsError)
        }
      } catch (error) {
        console.warn("Non-fatal: error updating user points:", error)
      }

      // Notify live progress consumers
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("course-progress-updated", {
            detail: { courseId: course.id, percentage: 100 },
          })
        )
      }

      toast({
        title: "Parabéns!",
        description: `Curso concluído! Você ganhou ${course.points_reward} pontos.`,
      })

      // Avoid refresh to keep navigation state; content already reflects completion
      // router.refresh()
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Video Content */}
      {course.video_url && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Play className="h-4 w-4 sm:h-5 sm:w-5" />
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

      {/* Text Content - Segmented */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Conteúdo do Curso</CardTitle>
            {sections.length > 0 && (
              <div className="text-xs sm:text-sm text-muted-foreground">
                Parte {Math.min(currentIndex + 1, sections.length)} de {sections.length}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {sections.length === 0 ? (
            <div className="text-muted-foreground">Sem conteúdo disponível.</div>
          ) : (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Responsive TOC: chips on mobile/tablet */}
              <div className="lg:hidden flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1 px-1 -mx-1 scroll-px-1 snap-x snap-mandatory">
                {sectionTitles.map((t, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`shrink-0 rounded-full border px-2 sm:px-3 py-1 text-xs whitespace-nowrap snap-start ${
                      i === currentIndex ? "bg-red-600 text-white border-transparent" : "hover:bg-red-50"
                    }`}
                    aria-current={i === currentIndex ? "step" : undefined}
                    aria-label={`Ir para ${t}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Grid with sidebar TOC and content */}
              <div className="grid gap-3 sm:gap-4 lg:grid-cols-5 lg:gap-6">
                {/* Sidebar TOC on large screens */}
                <aside className="hidden lg:block lg:col-span-2">
                  <div className="sticky top-24 space-y-2">
                    <div className="text-sm font-semibold text-muted-foreground">Sumário</div>
                    <nav className="space-y-1">
                      {sectionTitles.map((t, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`w-full text-left rounded-md px-3 py-2 text-sm border ${
                            i === currentIndex
                              ? "bg-red-50 border-red-200 text-red-800"
                              : "hover:bg-muted"
                          }`}
                          aria-current={i === currentIndex ? "step" : undefined}
                        >
                          {t}
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>

                {/* Main section text */}
                <div className="lg:col-span-3 space-y-3 sm:space-y-4">
                  <div className="relative">
                    <div
                      className={cn(
                        "prose max-w-none text-sm sm:text-base lg:text-lg leading-relaxed whitespace-pre-wrap transition-all break-words",
                        expanded
                          ? "max-h-none"
                          : "max-h-[20rem] sm:max-h-[24rem] md:max-h-[28rem] lg:max-h-[32rem] overflow-hidden"
                      )}
                    >
                      {sections[currentIndex]}
                    </div>
                    {!expanded && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-background to-transparent" />
                    )}
                  </div>

                  {/* Bullets and navigation */}
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center justify-center">
                      <Button variant="ghost" size="sm" onClick={() => setExpanded((v) => !v)} className="text-xs sm:text-sm">
                        {expanded ? "Ler menos" : "Ler mais"}
                      </Button>
                    </div>
                    <div className="flex items-center justify-center">
                      <Button 
                        size="sm" 
                        onClick={completeCurrentSection} 
                        disabled={userProgress?.completed}
                        className="text-xs sm:text-sm"
                      >
                        {userProgress?.completed 
                          ? "Curso já concluído" 
                          : currentIndex >= sections.length - 1 
                            ? "Concluir curso" 
                            : "Concluir e avançar"
                        }
                      </Button>
                    </div>

                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      {sections.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentIndex(i)}
                          className={`h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-2.5 md:w-2.5 rounded-full transition-colors ${
                            i === currentIndex ? "bg-red-600" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          aria-label={`Ir para parte ${i + 1}`}
                          aria-current={i === currentIndex ? "step" : undefined}
                        />
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                        disabled={currentIndex === 0}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" /> Anterior
                      </Button>

                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {Math.round(((currentIndex + 1) / sections.length) * 100)}%
                      </div>

                      <Button
                        size="sm"
                        onClick={() => setCurrentIndex((i) => Math.min(sections.length - 1, i + 1))}
                        disabled={currentIndex >= sections.length - 1}
                        className="text-xs sm:text-sm h-8 sm:h-9"
                      >
                        Próximo <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Quiz Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl">Quiz de Avaliação</CardTitle>
            {canManage && (
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto text-xs sm:text-sm">
                <Link href={`/courses/${course.id}/edit`}>Editar quiz</Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          {quizQuestions && quizQuestions.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {quizQuestions.map((q, idx) => (
                <div key={q.id || idx}>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base break-words">{idx + 1}. {q.question_text}</h4>
              <div className="space-y-2">
                    {(["a","b","c","d"] as const).map((opt) => {
                      const label = q[`option_${opt}`]
                      if (!label) return null
                      const key = `q${idx + 1}`
                      return (
                        <label key={opt} className="flex items-start space-x-2 text-sm sm:text-base">
                          <input type="radio" name={key} value={opt} checked={answers[key] === opt} onChange={() => handleAnswer(key, opt)} className="mt-0.5" />
                          <span className="break-words">{label}</span>
                </label>
                      )
                    })}
              </div>
                  {feedback[`q${idx + 1}`] && (
                    <div className={`mt-2 text-xs sm:text-sm ${feedback[`q${idx + 1}`] === "correct" ? "text-green-600" : "text-red-600"}`}>
                      {feedback[`q${idx + 1}`] === "correct" ? "Resposta correta!" : "Resposta incorreta. Tente novamente."}
                </div>
              )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs sm:text-sm text-muted-foreground">Nenhum quiz cadastrado para este curso.</div>
          )}
        </CardContent>
      </Card>

      {/* Completion Section */}
      {user && (
        <Card>
          <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
            {userProgress?.completed ? (
              <div className="text-center">
                <CheckCircle className="h-8 w-8 sm:h-12 sm:w-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">Curso Concluído!</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Este curso já foi concluído. Você ganhou {course.points_reward} pontos.
                </p>
                <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                  ⚠️ Cada curso só pode ser concluído uma vez.
                </p>
                <Button variant="outline" asChild className="text-xs sm:text-sm">
                  <Link href="/courses">Ver Outros Cursos</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Concluir Curso</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Marque como concluído para ganhar {course.points_reward} pontos!
                </p>
                <p className="text-xs text-muted-foreground mb-3 sm:mb-4">
                  ⚠️ Cada curso só pode ser concluído uma vez.
                </p>
                <Button onClick={markAsCompleted} disabled={loading} className="text-xs sm:text-sm">
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
