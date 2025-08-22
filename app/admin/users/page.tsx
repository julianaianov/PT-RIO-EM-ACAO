import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { redirect } from "next/navigation"
import { updateUserRole } from "@/lib/admin-actions"
import BackButton from "@/components/back-button"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  // auth + guard
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Você precisa estar logado")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") redirect("/?error=Acesso restrito ao admin")

  const { data: users } = await supabase.from("profiles").select("id, email, full_name, role, points").order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-white"><BackButton fallback="/admin" /></div>
      <Card className="border-red-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {users?.map((u) => (
            <form key={u.id} action={updateUserRole} className="flex items-center gap-3 border rounded-lg p-3 border-red-100">
              <input type="hidden" name="user_id" value={u.id} />
              <div className="flex-1">
                <div className="font-medium">{u.full_name || u.email}</div>
                <div className="text-sm text-muted-foreground">{u.email}</div>
              </div>
              <Select defaultValue={u.role} name="role">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Membro</SelectItem>
                  <SelectItem value="coordinator">Coordenador</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="bg-red-600 hover:bg-red-700">Salvar</Button>
            </form>
          ))}
        </CardContent>
      </Card>
    </div>
  )
} 