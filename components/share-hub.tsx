"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"

type ShareTarget = {
  label: string
  path: string
  message?: string
}

const TARGETS: ShareTarget[] = [
  { label: "Página Inicial", path: "/", message: "Plataforma Digital PT RJ em Ação" },
  { label: "Notícias", path: "/news" },
  { label: "Agenda", path: "/events" },
  { label: "Formação", path: "/courses" },
  { label: "Rádio", path: "/radio" },
  { label: "Movimentos", path: "/movements" },
  { label: "Juventude", path: "/youth" },
]

export default function ShareHub() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const origin = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }, [])

  const copy = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedKey(key)
      toast({ title: "Link copiado!", description: url })
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500)
    } catch (err) {
      toast({ title: "Erro ao copiar", variant: "destructive" })
    }
  }

  const shareWA = (message: string, url: string) => {
    const text = `${message ? message + "\n\n" : ""}${url}\n\n#PTRJ #PartidoDosTrabalhadores`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank")
  }

  const shareTG = (message: string, url: string) => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(message || "")}`, "_blank")
  }

  const shareFB = (_message: string, url: string) => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareTW = (message: string, url: string) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message || "")} &url=${encodeURIComponent(url)}`, "_blank")
  }

  return (
    <Card className="border-red-200">
      <CardContent className="p-4 space-y-3">
        {TARGETS.map((t) => {
          const url = `${origin}${t.path}`
          const key = t.path
          const msg = t.message || `Acompanhe ${t.label} na Plataforma PT RJ`
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-md p-2">
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Share2 className="h-4 w-4 text-red-600" /> {t.label}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => shareWA(msg, url)}>WhatsApp</Button>
                <Button variant="outline" size="sm" onClick={() => shareTG(msg, url)}>Telegram</Button>
                <Button variant="outline" size="sm" onClick={() => shareFB(msg, url)}>Facebook</Button>
                <Button variant="outline" size="sm" onClick={() => shareTW(msg, url)}>Twitter</Button>
                <Button variant="outline" size="sm" onClick={() => copy(url, key)}>
                  <Copy className="h-4 w-4 mr-1" /> {copiedKey === key ? "Copiado" : "Copiar"}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}


