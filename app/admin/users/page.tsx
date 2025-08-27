import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { updateUserRole } from "@/lib/admin-actions"
import BackButton from "@/components/back-button"
import { AdminUsersList } from "@/components/admin-users-list"

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { message?: string; error?: string }
}) {
  const supabase = await createClient()

  // auth + guard
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?error=Você precisa estar logado")

  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (me?.role !== "admin") redirect("/?error=Acesso restrito ao admin")

  const { data: users } = await supabase.from("profiles").select("id, email, full_name, role, points").order("created_at", { ascending: false })

  // Calcular estatísticas
  const stats = {
    total: users?.length || 0,
    admins: users?.filter(u => u.role === 'admin').length || 0,
    coordinators: users?.filter(u => u.role === 'coordinator').length || 0,
    members: users?.filter(u => u.role === 'member').length || 0,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 text-white"><BackButton fallback="/admin" /></div>
      
      {searchParams.message && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{searchParams.message}</p>
        </div>
      )}

      {searchParams.error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{searchParams.error}</p>
        </div>
      )}

      <AdminUsersList users={users || []} stats={stats} />
    </div>
  )
} 