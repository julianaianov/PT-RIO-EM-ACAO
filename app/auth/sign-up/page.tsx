import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signUp } from "@/lib/actions"
import { AuthFeedback } from "@/components/auth-feedback"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle } from "lucide-react"

export default async function SignUpPage({
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
          <div className="text-center mb-8">
            
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/logo-pt.png" alt="PT RJ" className="w-24 h-24 md:w-28 md:h-28 object-contain" />
            </div>
            <p className="text-gray-600">Junte-se à nossa luta</p>
          </div>

          <Card className="border-red-200 shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Cadastre-se</CardTitle>
              <CardDescription className="text-center">
                Crie sua conta para acessar a plataforma do PT RJ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signUp} className="space-y-4">
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
                  <Label htmlFor="fullName">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

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
                      minLength={6}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Mínimo de 6 caracteres</p>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                  Criar Conta
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Já tem uma conta?{" "}
                  <Link href="/auth/login" className="text-red-600 hover:text-red-700 font-medium">
                    Faça login
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