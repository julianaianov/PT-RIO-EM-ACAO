"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = {
  id: string
  group_id: string
  user_id: string
  content: string
  created_at: string
  author_name?: string | null
}

type PresenceUser = { user_id: string; name: string | null }

export default function GroupChat({ groupId, initialMessages, me, isClosed = false }: { groupId: string; initialMessages: Message[]; me: { id: string; name: string | null }; isClosed?: boolean }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || [])
  const [text, setText] = useState("")
  const [online, setOnline] = useState<PresenceUser[]>([])
  const listRef = useRef<HTMLDivElement | null>(null)
  const namesCacheRef = useRef<Map<string, string | null>>(new Map([[me.id, me.name || null]]))

  useEffect(() => {
    const channel = supabase.channel(`grp-${groupId}`, { config: { presence: { key: me.id } } })

    channel
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "youth_group_messages", filter: `group_id=eq.${groupId}` }, async (payload) => {
        const m = payload.new as Message
        let author = namesCacheRef.current.get(m.user_id) ?? null
        if (!author && m.user_id !== me.id) {
          const { data } = await supabase.from("profiles").select("full_name").eq("id", m.user_id).single()
          author = data?.full_name ?? null
          namesCacheRef.current.set(m.user_id, author)
        }
        setMessages((prev) => {
          if (prev.some((pm) => pm.id === m.id)) return prev
          return [...prev, { ...m, author_name: author ?? (m.user_id === me.id ? me.name : null) }]
        })
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState() as Record<string, Array<{ name?: string | null }>>
        const entries: PresenceUser[] = Object.entries(state).map(([user_id, metas]) => ({
          user_id,
          name: metas?.[0]?.name ?? null,
        }))
        setOnline(entries)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED" && !isClosed) {
          await channel.track({ name: me.name || "Usuário" })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId, me.id, me.name, isClosed])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  async function send() {
    if (isClosed) return
    const content = text.trim()
    if (!content) return
    setText("")
    const { data, error } = await supabase
      .from("youth_group_messages")
      .insert({ group_id: groupId, content, user_id: me.id })
      .select()
      .single()
    if (error) {
      setText(content)
      return
    }
    if (data) {
      setMessages((prev) => {
        if (prev.some((pm) => pm.id === data.id)) return prev
        return [...prev, { ...(data as any), author_name: me.name }]
      })
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  const formatted = useMemo(() => messages.map((m) => ({
    ...m,
    ts: new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  })), [messages])

  return (
    <div className="flex flex-col border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="text-sm font-semibold">Debate em tempo real</div>
        <div className="text-xs">{online.length} online</div>
      </div>
      <div className="px-3 pb-2 pt-1 flex flex-wrap gap-1 bg-white/80">
        {online.map((p) => (
          <span key={p.user_id} className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-700">
            {p.name || "Integrante"}
          </span>
        ))}
      </div>
      <div ref={listRef} className="p-3 space-y-3 h-80 overflow-y-auto bg-white/70">
        {formatted.map((m) => (
          <div key={m.id} className={`flex ${m.user_id === me.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[75%] rounded-lg px-3 py-2 ${m.user_id === me.id ? "bg-red-600 text-white" : "bg-gray-100"}`}>
              <div className="text-xs opacity-70 mb-1">{m.author_name || (m.user_id === me.id ? (me.name || "Você") : "Integrante")} • {m.ts}</div>
              <div className="whitespace-pre-wrap break-words">{m.content}</div>
            </div>
          </div>
        ))}
        {formatted.length === 0 && (
          <div className="text-sm text-gray-600">Nenhuma mensagem ainda. Dê o pontapé inicial!</div>
        )}
      </div>
      <div className="flex gap-2 p-3 bg-white/80">
        <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={onKey} placeholder={isClosed ? "Debate encerrado. Somente leitura." : "Escreva sua mensagem e pressione Enter"} disabled={isClosed} />
        <Button onClick={() => void send()} className="bg-red-600 hover:bg-red-700" disabled={isClosed}>Enviar</Button>
      </div>
    </div>
  )
} 