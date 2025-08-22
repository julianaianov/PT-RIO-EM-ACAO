import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import BackButton from "@/components/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  createYouthEvent, updateYouthEvent, deleteYouthEvent,
  createYouthMentorship, updateYouthMentorship, deleteYouthMentorship,
  createYouthGroup, updateYouthGroup, deleteYouthGroup,
  createYouthLeader, updateYouthLeader, deleteYouthLeader,
  createYouthOpportunity, updateYouthOpportunity, deleteYouthOpportunity,
  setYouthGroupActive,
  deleteMentorApplication, deleteMentorshipApplication,
} from "@/lib/youth-actions"

export default async function AdminYouthPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Login necessário")
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (!me || !["admin", "coordinator"].includes(me.role)) redirect("/admin?error=Acesso negado")

  const { data: events } = await supabase.from("youth_events").select("id, title, description, event_date, location, category, participants, max_participants, event_type, organizer, active").order("event_date", { ascending: true })
  const { data: mentorships } = await supabase.from("youth_mentorships").select("id, title, description, duration, mentors, mentees, next_cohort, level, active").order("title")
  const { data: groups } = await supabase.from("youth_groups").select("id, name, members, last_activity, topic, color, active, motive, purpose").order("name")
  const { data: leaders } = await supabase.from("youth_leaders").select("id, name, role, age, focus, image_url, active").order("name")
  const { data: opportunities } = await supabase.from("youth_opportunities").select("id, title, description, org, deadline, opportunity_type, active").order("deadline", { ascending: true })

  // Event attendees (for admin visibility)
  const { data: eventAtt } = await supabase.from("youth_event_attendees").select("event_id, user_id, created_at")
  const attendeeIds = Array.from(new Set((eventAtt || []).map((a: any) => a.user_id)))
  const { data: attendeeProfiles } = attendeeIds.length ? await supabase.from("profiles").select("id, full_name").in("id", attendeeIds) : { data: [] as any[] }
  const userIdToName = new Map<string, string>((attendeeProfiles || []).map((p: any) => [p.id, p.full_name]))
  const eventIdToNames = new Map<string, string[]>()
  ;(eventAtt || []).forEach((a: any) => {
    const list = eventIdToNames.get(a.event_id) || []
    list.push(userIdToName.get(a.user_id) || a.user_id)
    eventIdToNames.set(a.event_id, list)
  })

  // Applications (mentees)
  const { data: menteeApps } = await supabase.from("youth_mentorship_applications").select("id, program_id, user_id, motivation, created_at")
  const menteeIds = (menteeApps || []).map(a => a.user_id)
  const { data: menteeProfiles } = menteeIds.length ? await supabase.from("profiles").select("id, full_name").in("id", menteeIds) : { data: [] as any[] }
  const idToName = new Map<string, string>((menteeProfiles || []).map((p: any) => [p.id, p.full_name]))

  // Mentor applications
  const { data: mentorApps } = await supabase.from("youth_mentor_applications").select("id, user_id, areas, message, created_at")
  const mentorIds = (mentorApps || []).map(a => a.user_id)
  const { data: mentorProfiles } = mentorIds.length ? await supabase.from("profiles").select("id, full_name").in("id", mentorIds) : { data: [] as any[] }
  const mentorIdToName = new Map<string, string>((mentorProfiles || []).map((p: any) => [p.id, p.full_name]))

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-4 text-white"><BackButton fallback="/admin" /></div>
      <h1 className="text-2xl font-bold text-white mb-4">Gerenciar Juventude</h1>

      {/* Events */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Eventos</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-4">
          <form action={createYouthEvent} className="grid md:grid-cols-3 gap-3 items-end">
            <div className="md:col-span-2">
              <Label>Título</Label>
              <Input name="title" required />
            </div>
            <div>
              <Label>Data/hora</Label>
              <Input name="event_date" type="datetime-local" required />
            </div>
            <div>
              <Label>Local</Label>
              <Input name="location" />
            </div>
            <div>
              <Label>Categoria</Label>
              <Input name="category" />
            </div>
            <div>
              <Label>Tipo</Label>
              <Input name="event_type" placeholder="Online ou Presencial" />
            </div>
            <div>
              <Label>Participantes</Label>
              <Input name="participants" type="number" defaultValue={0} />
            </div>
            <div>
              <Label>Máx. participantes</Label>
              <Input name="max_participants" type="number" />
            </div>
            <div className="md:col-span-2">
              <Label>Descrição</Label>
              <Textarea name="description" rows={2} />
            </div>
            <div>
              <Label>Organizador</Label>
              <Input name="organizer" />
            </div>
            <div>
              <Label>Ativo</Label>
              <Input name="active" defaultValue="true" />
            </div>
            <div className="md:col-span-3 flex justify-end"><Button className="bg-red-600 hover:bg-red-700">Adicionar</Button></div>
          </form>
          <div className="space-y-3">
            {(events || []).map((e) => (
              <form key={e.id} action={updateYouthEvent} className="grid md:grid-cols-6 gap-2 items-end border rounded p-3">
                <Input type="hidden" name="id" defaultValue={e.id} />
                <Input name="title" defaultValue={e.title} />
                <Input name="event_date" type="datetime-local" defaultValue={new Date(e.event_date).toISOString().slice(0,16)} />
                <Input name="location" defaultValue={e.location || ''} />
                <Input name="category" defaultValue={e.category || ''} />
                <Input name="event_type" defaultValue={e.event_type || ''} />
                <Input name="participants" type="number" defaultValue={e.participants || 0} />
                <Input name="max_participants" type="number" defaultValue={e.max_participants || 0} />
                <Input name="organizer" defaultValue={e.organizer || ''} />
                <Textarea name="description" rows={1} defaultValue={e.description || ''} />
                <Input name="active" defaultValue={String(e.active)} />

                <div className="col-span-full text-xs text-gray-700">
                  <div className="font-medium mb-1">Confirmados ({(eventIdToNames.get(e.id) || []).length})</div>
                  <div className="flex flex-wrap gap-2">
                    {(eventIdToNames.get(e.id) || []).map((n, idx) => (
                      <span key={idx} className="px-2 py-1 bg-red-50 text-red-700 rounded-full">{n}</span>
                    ))}
                    {((eventIdToNames.get(e.id) || []).length === 0) && (
                      <span className="text-gray-500">Nenhum confirmado ainda.</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end col-span-full">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
                  <Button formAction={deleteYouthEvent} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentorships */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Mentorias</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-4">
          <form action={createYouthMentorship} className="grid md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2"><Label>Título</Label><Input name="title" required /></div>
            <div><Label>Duração</Label><Input name="duration" /></div>
            <div><Label>Mentores</Label><Input name="mentors" type="number" /></div>
            <div><Label>Vagas</Label><Input name="mentees" type="number" /></div>
            <div><Label>Próxima turma</Label><Input name="next_cohort" /></div>
            <div><Label>Nível</Label><Input name="level" /></div>
            <div className="md:col-span-6"><Label>Descrição</Label><Textarea name="description" rows={2} /></div>
            <div className="md:col-span-6 flex justify-end"><Button className="bg-red-600 hover:bg-red-700">Adicionar</Button></div>
          </form>
          <div className="space-y-3">
            {(mentorships || []).map((m) => (
              <form key={m.id} action={updateYouthMentorship} className="grid md:grid-cols-6 gap-2 items-end border rounded p-3">
                <Input type="hidden" name="id" defaultValue={m.id} />
                <div className="md:col-span-2"><Label>Título</Label><Input name="title" defaultValue={m.title} /></div>
                <div><Label>Duração</Label><Input name="duration" defaultValue={m.duration || ''} /></div>
                <div><Label>Mentores</Label><Input name="mentors" type="number" defaultValue={m.mentors || 0} /></div>
                <div><Label>Vagas</Label><Input name="mentees" type="number" defaultValue={m.mentees || 0} /></div>
                <div><Label>Próxima turma</Label><Input name="next_cohort" defaultValue={m.next_cohort || ''} /></div>
                <div><Label>Nível</Label><Input name="level" defaultValue={m.level || ''} /></div>
                <div className="md:col-span-6"><Label>Descrição</Label><Textarea name="description" rows={1} defaultValue={m.description || ''} /></div>
                <div className="md:col-span-6 flex gap-2 justify-end">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
                  <Button formAction={deleteYouthMentorship} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications: Candidatos a Mentoria */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Candidaturas a Mentoria</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-3">
          {(menteeApps || []).map((a) => (
            <form key={a.id} action={deleteMentorshipApplication} className="flex items-center justify-between border rounded p-3">
              <input type="hidden" name="id" defaultValue={a.id} />
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{idToName.get(a.user_id) || a.user_id}</span>
                <span className="text-gray-500"> • {new Date(a.created_at as any).toLocaleString("pt-BR")}</span>
                {a.motivation ? <span className="block text-gray-600">{a.motivation}</span> : null}
              </div>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Remover</Button>
            </form>
          ))}
          {(!menteeApps || menteeApps.length === 0) && <div className="text-sm text-gray-600">Nenhuma candidatura enviada.</div>}
        </CardContent>
      </Card>

      {/* Applications: Inscrições de Mentores */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Inscrições de Mentores</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-3">
          {(mentorApps || []).map((a) => (
            <form key={a.id} action={deleteMentorApplication} className="flex items-center justify-between border rounded p-3">
              <input type="hidden" name="id" defaultValue={a.id} />
              <div className="text-sm text-gray-800">
                <span className="font-semibold">{mentorIdToName.get(a.user_id) || a.user_id}</span>
                <span className="text-gray-500"> • {new Date(a.created_at as any).toLocaleString("pt-BR")}</span>
                {a.areas ? <span className="block text-gray-600">Áreas: {a.areas}</span> : null}
                {a.message ? <span className="block text-gray-600">{a.message}</span> : null}
              </div>
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Remover</Button>
            </form>
          ))}
          {(!mentorApps || mentorApps.length === 0) && <div className="text-sm text-gray-600">Nenhuma inscrição de mentor.</div>}
        </CardContent>
      </Card>

      {/* Groups */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Grupos</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-4">
          <form action={createYouthGroup} className="grid md:grid-cols-6 gap-3 items-end">
            <div className="md:col-span-2"><Label>Nome</Label><Input name="name" required /></div>
            <div><Label>Membros</Label><Input name="members" type="number" /></div>
            <div><Label>Última atividade</Label><Input name="last_activity" /></div>
            <div><Label>Tópico</Label><Input name="topic" /></div>
            <div><Label>Motivo</Label><Input name="motive" /></div>
            <div><Label>Finalidade</Label><Input name="purpose" /></div>
            <div><Label>Cor</Label><Input name="color" placeholder="#ef4444" /></div>
            <div className="md:col-span-5 flex justify-end"><Button className="bg-red-600 hover:bg-red-700">Adicionar</Button></div>
          </form>
          <div className="space-y-3">
            {(groups || []).map((g) => (
              <form key={g.id} action={updateYouthGroup} className="grid md:grid-cols-6 gap-2 items-end border rounded p-3">
                <Input type="hidden" name="id" defaultValue={g.id} />
                <div className="md:col-span-2"><Label>Nome</Label><Input name="name" defaultValue={g.name} /></div>
                <div><Label>Membros</Label><Input name="members" type="number" defaultValue={g.members || 0} /></div>
                <div><Label>Última atividade</Label><Input name="last_activity" defaultValue={g.last_activity || ''} /></div>
                <div><Label>Tópico</Label><Input name="topic" defaultValue={g.topic || ''} /></div>
                <div><Label>Motivo</Label><Input name="motive" defaultValue={(g as any).motive || ''} /></div>
                <div><Label>Finalidade</Label><Input name="purpose" defaultValue={(g as any).purpose || ''} /></div>
                <div><Label>Cor</Label><Input name="color" defaultValue={g.color || ''} /></div>
                <div className="md:col-span-6 flex flex-wrap gap-2 justify-end items-end">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
                  <Button formAction={deleteYouthGroup} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                  <div className="flex items-end gap-2">
                    <div>
                      <Label>Status do debate</Label>
                      <Select name="active" defaultValue={String((g as any).active !== false)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>
                          <SelectItem value="false">Encerrar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button formAction={setYouthGroupActive} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Aplicar</Button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leaders */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Lideranças</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-4">
          <form action={createYouthLeader} className="grid md:grid-cols-5 gap-3 items-end">
            <div className="md:col-span-2"><Label>Nome</Label><Input name="name" required /></div>
            <div><Label>Papel</Label><Input name="role" /></div>
            <div><Label>Idade</Label><Input name="age" type="number" /></div>
            <div><Label>Foco</Label><Input name="focus" /></div>
            <div><Label>Imagem (URL)</Label><Input name="image_url" /></div>
            <div className="md:col-span-5 flex justify-end"><Button className="bg-red-600 hover:bg-red-700">Adicionar</Button></div>
          </form>
          <div className="space-y-3">
            {(leaders || []).map((l) => (
              <form key={l.id} action={updateYouthLeader} className="grid md:grid-cols-5 gap-2 items-end border rounded p-3">
                <Input type="hidden" name="id" defaultValue={l.id} />
                <div className="md:col-span-2"><Label>Nome</Label><Input name="name" defaultValue={l.name} /></div>
                <div><Label>Papel</Label><Input name="role" defaultValue={l.role || ''} /></div>
                <div><Label>Idade</Label><Input name="age" type="number" defaultValue={l.age || 0} /></div>
                <div><Label>Foco</Label><Input name="focus" defaultValue={l.focus || ''} /></div>
                <div><Label>Imagem (URL)</Label><Input name="image_url" defaultValue={l.image_url || ''} /></div>
                <div className="md:col-span-5 flex gap-2 justify-end">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
                  <Button formAction={deleteYouthLeader} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunities */}
      <Card className="mb-6 border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white"><CardTitle>Oportunidades</CardTitle></CardHeader>
        <CardContent className="p-4 space-y-4">
          <form action={createYouthOpportunity} className="grid md:grid-cols-5 gap-3 items-end">
            <div className="md:col-span-2"><Label>Título</Label><Input name="title" required /></div>
            <div><Label>Org</Label><Input name="org" /></div>
            <div><Label>Tipo</Label><Input name="opportunity_type" /></div>
            <div><Label>Prazo</Label><Input name="deadline" type="date" /></div>
            <div className="md:col-span-5"><Label>Descrição</Label><Textarea name="description" rows={2} /></div>
            <div className="md:col-span-5 flex justify-end"><Button className="bg-red-600 hover:bg-red-700">Adicionar</Button></div>
          </form>
          <div className="space-y-3">
            {(opportunities || []).map((o) => (
              <form key={o.id} action={updateYouthOpportunity} className="grid md:grid-cols-5 gap-2 items-end border rounded p-3">
                <Input type="hidden" name="id" defaultValue={o.id} />
                <div className="md:col-span-2"><Label>Título</Label><Input name="title" defaultValue={o.title} /></div>
                <div><Label>Org</Label><Input name="org" defaultValue={o.org || ''} /></div>
                <div><Label>Tipo</Label><Input name="opportunity_type" defaultValue={o.opportunity_type || ''} /></div>
                <div><Label>Prazo</Label><Input name="deadline" type="date" defaultValue={o.deadline ? new Date(o.deadline).toISOString().slice(0,10) : ''} /></div>
                <div className="md:col-span-5"><Label>Descrição</Label><Textarea name="description" rows={1} defaultValue={o.description || ''} /></div>
                <div className="md:col-span-5 flex gap-2 justify-end">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
                  <Button formAction={deleteYouthOpportunity} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">Excluir</Button>
                </div>
              </form>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 