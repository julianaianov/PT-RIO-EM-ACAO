import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import GroupChat from "@/components/group-chat"
import GroupPoll from "@/components/group-poll"

export default async function YouthGroupPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: group } = await supabase.from("youth_groups").select("id, name, topic, color, motive, purpose, active").eq("id", params.id).single()
  if (!group) redirect("/youth?error=Grupo não encontrado")

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?error=Login necessário&next=/youth/groups/${params.id}`)

  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single()

  const { data: messages } = await supabase
    .from("youth_group_messages")
    .select("id, group_id, user_id, content, created_at, profiles(full_name)")
    .eq("group_id", params.id)
    .order("created_at", { ascending: true })

  const initialMessages = (messages || []).map((m: any) => ({
    id: m.id,
    group_id: m.group_id,
    user_id: m.user_id,
    content: m.content,
    created_at: m.created_at,
    author_name: m.profiles?.full_name || null,
  }))

  const isClosed = group.active === false

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 text-white"><BackButton fallback="/youth" /></div>
      <Card className="border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle className="text-xl">{group.name}</CardTitle>
          <div className="text-sm opacity-90 mt-1">{group.topic}</div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 bg-white/60">
          {!isClosed ? null : (
            <div className="text-sm text-red-700 bg-red-100 border border-red-200 rounded px-3 py-2">
              Debate finalizado. Mensagens ficam disponíveis apenas para consulta.
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500">Motivo</div>
              <div className="text-sm text-gray-800">{group.motive || "—"}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Finalidade</div>
              <div className="text-sm text-gray-800">{group.purpose || "—"}</div>
            </div>
          </div>
          <GroupChat groupId={group.id} initialMessages={initialMessages} me={{ id: user.id, name: profile?.full_name || null }} isClosed={isClosed} />
          <GroupPoll groupId={group.id} me={{ id: user.id, name: profile?.full_name || null }} />
        </CardContent>
      </Card>
    </div>
  )
} 