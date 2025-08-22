import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signIn } from "@/lib/actions"
import { AuthFeedback } from "@/components/auth-feedback"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const supabase = await createClient()
  const params = await searchParams

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <>
      <AuthFeedback />
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 md:mb-8">
            <Link href="/" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
            <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
              <img src="/logo-pt.png" alt="PT RJ" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>
            <p className="text-gray-600 text-sm md:text-base">Acesse sua conta</p>
          </div>

          <Card className="border-red-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl md:text-2xl text-center">Entrar</CardTitle>
              <CardDescription className="text-center text-sm md:text-base">
                Digite suas credenciais para acessar a plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signIn} className="space-y-4">
                {params.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{params.error}</AlertDescription>
                  </Alert>
                )}
                
                {params.message && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{params.message}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Entrar
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Não tem uma conta?{" "}
                  <Link href="/auth/sign-up" className="text-red-600 hover:text-red-700 font-medium">
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Poder Popular - Rio de Janeiro</p>
          </div>
        </div>
      </div>
    </>
  )
} 