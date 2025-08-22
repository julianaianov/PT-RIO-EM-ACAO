import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BackButton from "@/components/back-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, TrendingUp, CheckCircle2, School, Vote } from "lucide-react"

function getInitials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((part: string) => part[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function getLevel(points: number) {
  if (points >= 500) return { name: "Líder", nextAt: 1000 }
  if (points >= 250) return { name: "Avançado", nextAt: 500 }
  if (points >= 100) return { name: "Intermediário", nextAt: 250 }
  return { name: "Iniciante", nextAt: 100 }
}

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  const me = auth.user

  const { data: profile } = me
    ? await supabase.from("profiles").select("id, full_name, avatar_url, points").eq("id", me.id).single()
    : { data: null as any }

  const myPoints = Number(profile?.points || 0)
  const level = getLevel(myPoints)

  const { count: ahead } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .gt("points", myPoints)

  const { count: total } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })

  const myRank = typeof ahead === "number" ? ahead + 1 : undefined

  const { data: txs } = me
    ? await supabase
        .from("point_transactions")
        .select("id, Delta, reason, created_at")
        .eq("user_id", me.id)
        .order("created_at", { ascending: false })
        .limit(20)
    : { data: [] as any[] }

  const { data: top } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, points")
    .order("points", { ascending: false })
    .limit(5)

  const progressPct = Math.min(100, Math.round((myPoints / level.nextAt) * 100))

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#B71C1C] via-[#E53935] to-[#C62828]">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 text-white"><BackButton fallback="/" /></div>
        <h1 className="text-2xl font-bold text-white mb-4">Meus Pontos</h1>

        {/* Summary */}
        <Card className="mb-6 border-red-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
            <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5" /> Seu Desempenho</CardTitle>
          </CardHeader>
          <CardContent className="p-4 bg-white/70">
            {!me ? (
              <div className="flex items-center justify-between">
                <div className="text-gray-700">Faça login para ver seus pontos e histórico.</div>
                <Button asChild className="bg-red-600 hover:bg-red-700"><Link href="/auth/login">Entrar</Link></Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name || 'Usuário'} className="w-14 h-14 rounded-full object-cover ring-2 ring-red-400" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center font-bold ring-2 ring-red-400">{getInitials(profile?.full_name)}</div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">{profile?.full_name || 'Usuário'}</div>
                    <div className="text-sm text-gray-600">Nível: {level.name}</div>
                  </div>
                </div>
                <div className="md:text-center">
                  <div className="text-3xl font-extrabold text-red-700">{myPoints} pts</div>
                  <div className="text-xs text-gray-600">Meta: {level.nextAt} pts</div>
                  <div className="h-2 mt-2 bg-red-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-700" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="flex md:justify-end items-center gap-2 text-gray-700"><TrendingUp className="h-4 w-4" /> Ranking: {myRank ? `#${myRank} de ${total || '-'}` : '-'}</div>
                  <div className="mt-2 flex gap-2 justify-end">
                    <Button asChild size="sm" className="bg-red-600 hover:bg-red-700"><Link href="/ranking">Ver Ranking</Link></Button>
                    <Button asChild size="sm" variant="outline" className="border-red-600 text-red-600"><Link href="/youth">Ir para Juventude</Link></Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Ways to earn */}
          <Card className="border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Como ganhar pontos</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white/70 space-y-3 text-sm text-gray-700">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-red-600" /> Confirmar presença em eventos (+5)</div>
              <div className="flex items-center gap-2"><School className="h-4 w-4 text-red-600" /> Concluir cursos (+10 ou conforme curso)</div>
              <div className="flex items-center gap-2"><Vote className="h-4 w-4 text-red-600" /> Votar em enquetes de grupos (+1)</div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline" className="border-red-600 text-red-600"> <Link href="/youth">Eventos/Grupos</Link></Button>
                <Button asChild size="sm" variant="outline" className="border-red-600 text-red-600"> <Link href="/courses">Cursos</Link></Button>
                      </div>
                    </CardContent>
                  </Card>

          {/* Top 5 */}
          <Card className="border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Top 5</CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white/70 divide-y">
              {(top || []).map((u, i) => (
                <div key={u.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-5 text-xs text-gray-500 text-right">{i+1}</span>
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt={u.full_name || 'Usuário'} className="w-7 h-7 rounded-full object-cover ring-1 ring-red-300" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-red-300">{getInitials(u.full_name)}</div>
                    )}
                    <span className="truncate text-gray-800 text-sm">{u.full_name || 'Usuário'}</span>
                        </div>
                  <div className="text-red-700 text-sm font-semibold">{u.points || 0} pts</div>
                    </div>
              ))}
              {(!top || top.length === 0) && (<div className="text-xs text-gray-600">Sem dados.</div>)}
            </CardContent>
          </Card>

          {/* History */}
          <Card className="md:col-span-1 md:col-start-1 border-red-200 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <CardTitle>Histórico</CardTitle>
              </CardHeader>
            <CardContent className="p-4 bg-white/70 divide-y text-sm text-gray-800">
              {(txs || []).map((t: any) => (
                <div key={t.id} className="flex items-center justify-between py-2">
                  <div className="truncate">{t.reason || 'Ajuste'}</div>
                  <div className={`${t.Delta >= 0 ? 'text-green-700' : 'text-red-700'} font-semibold`}>{t.Delta >= 0 ? `+${t.Delta}` : t.Delta} pts</div>
                </div>
              ))}
              {(!txs || txs.length === 0) && (
                <div className="text-xs text-gray-600">Sem lançamentos ainda.</div>
              )}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
