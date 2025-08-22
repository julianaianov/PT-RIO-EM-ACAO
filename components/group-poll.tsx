"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function GroupPoll({ groupId, me, initialPoll }: { groupId: string; me: { id: string; name: string | null }; initialPoll?: any }) {
  const [poll, setPoll] = useState<any | null>(initialPoll || null)
  const [options, setOptions] = useState<any[]>([])
  const [votes, setVotes] = useState<any[]>([])
  const [question, setQuestion] = useState("")
  const [newOption, setNewOption] = useState("")

  useEffect(() => {
    let mounted = true

    async function load() {
      if (!poll) {
        const { data: latest } = await supabase
          .from("youth_group_polls")
          .select("id, question, created_at, closes_at")
          .eq("group_id", groupId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()
        if (mounted) setPoll(latest)
      }
      if (poll) {
        const [{ data: opts }, { data: vts }] = await Promise.all([
          supabase.from("youth_group_poll_options").select("id, option_text").eq("poll_id", poll.id),
          supabase.from("youth_group_poll_votes").select("id, option_id, user_id").eq("poll_id", poll.id),
        ])
        if (mounted) {
          setOptions(opts || [])
          setVotes(vts || [])
        }
      }
    }
    void load()

    const ch = supabase
      .channel(`poll-${groupId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "youth_group_polls", filter: `group_id=eq.${groupId}` }, (p) => {
        setPoll(p.new as any)
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "youth_group_poll_options" }, (p) => {
        const row = p.new as any
        if (poll && row.poll_id === poll.id) setOptions((prev) => [...prev, row])
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "youth_group_poll_votes" }, (p) => {
        const row = p.new as any
        if (poll && row.poll_id === poll.id) setVotes((prev) => [...prev, row])
      })
      .subscribe()

    return () => {
      mounted = false
      supabase.removeChannel(ch)
    }
  }, [groupId, poll?.id])

  async function createPoll() {
    const q = question.trim()
    const o = newOption.trim()
    if (!q || !o) return
    const { data: created } = await supabase
      .from("youth_group_polls")
      .insert({ group_id: groupId, question: q, created_by: me.id })
      .select()
      .single()
    if (!created) return
    await supabase.from("youth_group_poll_options").insert({ poll_id: created.id, option_text: o })
    setQuestion("")
    setNewOption("")
    setPoll(created)
  }

  async function vote(optionId: string) {
    if (!poll) return
    try {
      await supabase.from("youth_group_poll_votes").insert({ poll_id: poll.id, option_id: optionId })
    } catch (e) {
      // ignore duplicate vote errors due to unique constraint
    }
  }

  const results = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const o of options) counts[o.id] = 0
    for (const v of votes) if (counts[v.option_id] !== undefined) counts[v.option_id]++
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    return { counts, total }
  }, [options, votes])

  if (!poll) {
    return (
      <div className="border rounded-lg p-3 bg-white/80">
        <div className="text-sm font-semibold mb-2">Criar enquete</div>
        <div className="grid md:grid-cols-3 gap-2">
          <Input placeholder="Pergunta" value={question} onChange={(e) => setQuestion(e.target.value)} />
          <Input placeholder="Primeira opção" value={newOption} onChange={(e) => setNewOption(e.target.value)} />
          <Button onClick={() => void createPoll()} className="bg-red-600 hover:bg-red-700">Criar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-3 bg-white/80">
      <div className="text-sm font-semibold mb-2">Enquete: {poll.question}</div>
      <div className="space-y-2">
        {options.map((o) => {
          const c = results.counts[o.id] || 0
          const pct = results.total ? Math.round((c / results.total) * 100) : 0
          return (
            <div key={o.id} className="flex items-center gap-3">
              <Button size="sm" variant="outline" className="border-red-600 text-red-700" onClick={() => void vote(o.id)}>Votar</Button>
              <div className="flex-1">
                <div className="text-sm">{o.option_text}</div>
                <div className="h-2 bg-gray-200 rounded">
                  <div className="h-2 bg-red-600 rounded" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="w-12 text-right text-xs">{pct}%</div>
            </div>
          )
        })}
      </div>
      <div className="text-xs text-gray-500 mt-2">Total de votos: {results.total}</div>
    </div>
  )
} 