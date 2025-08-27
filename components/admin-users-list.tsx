"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserRoleBadge } from "@/components/user-role-badge"
import { UserSearch } from "@/components/user-search"
import { useState } from "react"

interface User {
  id: string
  email: string
  full_name: string | null
  role: string
  points: number
}

interface AdminUsersListProps {
  users: User[]
  stats: {
    total: number
    admins: number
    coordinators: number
    members: number
  }
}

export function AdminUsersList({ users, stats }: AdminUsersListProps) {
  const [filteredUsers, setFilteredUsers] = useState(users)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredUsers(users)
      return
    }

    const filtered = users.filter(user => 
      user.full_name?.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.role.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  return (
    <Card className="border-red-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-red-800">Gerenciar Usuários</CardTitle>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Total: {stats.total}</span>
          <span>Admins: {stats.admins}</span>
          <span>Coordenadores: {stats.coordinators}</span>
          <span>Membros: {stats.members}</span>
        </div>
        <div className="mt-4">
          <UserSearch onSearch={handleSearch} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum usuário encontrado
          </div>
        ) : (
          filteredUsers.map((u) => (
            <form key={u.id} action="/admin/users" className="border rounded-lg p-4 border-red-100 bg-white">
              <input type="hidden" name="user_id" value={u.id} />
              
              {/* Layout responsivo */}
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Informações do usuário */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="font-medium text-gray-900 truncate">
                      {u.full_name || u.email}
                    </div>
                    <UserRoleBadge role={u.role} />
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {u.email}
                  </div>
                  {u.points !== undefined && (
                    <div className="text-xs text-gray-400 mt-1">
                      Pontos: {u.points}
                    </div>
                  )}
                </div>

                {/* Controles - empilhados em mobile, lado a lado em desktop */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <Select defaultValue={u.role} name="role">
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">Membro</SelectItem>
                      <SelectItem value="coordinator">Coordenador</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
                  >
                    Salvar
                  </Button>
                </div>
              </div>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  )
}
