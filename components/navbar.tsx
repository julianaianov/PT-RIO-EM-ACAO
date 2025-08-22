import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/lib/actions"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function Navbar() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let role: string | null = null
  let fullName: string | null = null
  if (user) {
    const { data: me } = await supabase.from("profiles").select("role, full_name").eq("id", user.id).single()
    role = me?.role ?? null
    fullName = me?.full_name ?? null
  }

  const links = [
    { href: "/", label: "Início" },
    { href: "/news", label: "Notícias" },
    { href: "/events", label: "Agenda" },
    { href: "/courses", label: "Formação" },
    { href: "/nucleos", label: "Núcleos" },
    { href: "/radio", label: "Rádio" },
    { href: "/movements", label: "Movimentos" },
    { href: "/youth", label: "Juventude" },
    { href: "/points", label: "Pontos" },
  ]

  return (
    <nav className="sticky top-0 z-40 border-b border-red-100 bg-white shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 h-16 md:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo-pt.png" alt="PT RJ" className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover" />
        </Link>

        {/* Desktop menu */}
        <ul className="hidden lg:flex items-center gap-2 sm:gap-3 text-sm">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className="inline-block px-2.5 py-1.5 rounded-md text-gray-700 hover:text-red-700 hover:bg-red-50 font-medium">
                {label}
              </Link>
            </li>
          ))}
          {role === "admin" && (
            <li>
              <Link href="/admin" className="inline-block px-2.5 py-1.5 rounded-md text-gray-700 hover:text-red-700 hover:bg-red-50 font-medium">
                Admin
              </Link>
            </li>
          )}
          {user ? (
            <li>
              <form action={signOut}>
                <Button variant="outline" size="sm" className="border-red-600 text-red-600 hover:bg-red-50">
                  Sair
                </Button>
              </form>
            </li>
          ) : (
            <li>
              <Button asChild size="sm" className="bg-red-600 hover:bg-red-700">
                <Link href="/auth/login">Entrar</Link>
              </Button>
            </li>
          )}
        </ul>

        {/* Mobile menu */}
        <details className="lg:hidden relative">
          <summary className="list-none cursor-pointer inline-flex items-center gap-2 px-2 py-1 rounded-md text-gray-700 hover:bg-red-50">
            <Menu className="h-5 w-5 text-red-700" />
            <span className="text-sm">Menu</span>
          </summary>
          <div className="absolute right-0 mt-2 w-64 rounded-md border bg-white shadow-md p-2">
            <div className="px-3 py-2 text-xs text-gray-500">
              {user ? `Olá, ${fullName || user.email}` : "Navegação"}
            </div>
            <ul className="flex flex-col">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="block px-3 py-2 rounded hover:bg-red-50">
                    {label}
                  </Link>
                </li>
              ))}
              {role === "admin" && (
                <li>
                  <Link href="/admin" className="block px-3 py-2 rounded hover:bg-red-50">
                    Admin
                  </Link>
                </li>
              )}
              <li className="border-t my-1" />
              {user ? (
                <li className="px-3 py-2">
                  <form action={signOut}>
                    <Button variant="outline" className="w-full border-red-600 text-red-600 hover:bg-red-50">
                      Sair
                    </Button>
                  </form>
                </li>
              ) : (
                <li className="px-3 py-2">
                  <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                    <Link href="/auth/login">Entrar</Link>
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </details>
      </div>
    </nav>
  )
} 