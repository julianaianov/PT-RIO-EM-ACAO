import Link from "next/link"
import { Calendar, Newspaper, BookOpen, MapPin, Radio, Users, Zap, Trophy } from "lucide-react"

const menuItems = [
  { name: "Agenda", href: "/events", icon: Calendar, color: "bg-red-500" },
  { name: "Notícias", href: "/news", icon: Newspaper, color: "bg-blue-500" },
  { name: "Formação", href: "/courses", icon: BookOpen, color: "bg-green-500" },
  { name: "Núcleos", href: "/nucleos", icon: MapPin, color: "bg-purple-500" },
  { name: "Rádio PT", href: "/radio", icon: Radio, color: "bg-red-600" },
  { name: "Movimentos", href: "/movements", icon: Users, color: "bg-teal-500" },
  { name: "Juventude", href: "/youth", icon: Zap, color: "bg-pink-500" },
  { name: "Ranking", href: "/ranking", icon: Trophy, color: "bg-yellow-500" },
]

export default function QuickMenu() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4 text-white">Menu Rápido</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link key={item.name} href={item.href} className="min-w-0">
              <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow border border-red-100 hover:border-red-200 group h-full">
                <div
                  className={`${item.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-xs sm:text-sm group-hover:text-red-700 truncate">{item.name}</h3>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
