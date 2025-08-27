import { Badge } from "@/components/ui/badge"
import { Crown, Users, User } from "lucide-react"

interface UserRoleBadgeProps {
  role: string
  className?: string
}

export function UserRoleBadge({ role, className = "" }: UserRoleBadgeProps) {
  const roleConfig = {
    admin: {
      label: "Admin",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: Crown,
    },
    coordinator: {
      label: "Coordenador",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Users,
    },
    member: {
      label: "Membro",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: User,
    },
  }

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.member
  const Icon = config.icon

  return (
    <Badge className={`${config.color} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}

