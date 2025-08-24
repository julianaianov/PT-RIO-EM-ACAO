"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface QuizEditorProps {
  courseId: string
  initialQuestions: any[]
  action: (formData: FormData) => void
}

export default function QuizEditor({ courseId, initialQuestions, action }: QuizEditorProps) {
  const [questions, setQuestions] = useState<any[]>(initialQuestions || [])

  const addQuestion = () => {
    setQuestions((q) => [
      ...q,
      { question_text: "", option_a: "", option_b: "", option_c: "", option_d: "", correct_option: "a" },
    ])
  }

  const update = (idx: number, key: string, value: string) => {
    setQuestions((q) => q.map((it, i) => (i === idx ? { ...it, [key]: value } : it)))
  }

  const remove = (idx: number) => setQuestions((q) => q.filter((_, i) => i !== idx))

  return (
    <Card className="border-red-200">
      <CardHeader>
        <CardTitle className="text-red-800">Quiz do Curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={action} className="space-y-6">
          <input type="hidden" name="course_id" value={courseId} />
          <input type="hidden" name="questions_json" value={JSON.stringify(questions.map((q, i) => ({ ...q, sort_order: i })))} />

          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="grid md:grid-cols-2 gap-4 border rounded p-3">
                <div className="md:col-span-2 space-y-2">
                  <Label>Pergunta</Label>
                  <Input value={q.question_text} onChange={(e) => update(idx, "question_text", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opção A</Label>
                  <Input value={q.option_a} onChange={(e) => update(idx, "option_a", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opção B</Label>
                  <Input value={q.option_b} onChange={(e) => update(idx, "option_b", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opção C</Label>
                  <Input value={q.option_c || ""} onChange={(e) => update(idx, "option_c", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Opção D</Label>
                  <Input value={q.option_d || ""} onChange={(e) => update(idx, "option_d", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Resposta Correta</Label>
                  <Select value={q.correct_option} onValueChange={(v) => update(idx, "correct_option", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">A</SelectItem>
                      <SelectItem value="b">B</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="d">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 flex justify-end">
                  <Button type="button" variant="outline" onClick={() => remove(idx)}>Remover</Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addQuestion}>Adicionar Pergunta</Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar Quiz</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}


