"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Share2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import ExternalLinkPreview from "./external-link-preview"

type ShareLink = {
  id: string
  label: string
  path: string
  message?: string
  icon: string
  color: string
  order_index: number
  active: boolean
}

interface ShareHubProps {
  links: ShareLink[]
}

export default function ShareHub({ links }: ShareHubProps) {
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

  // Filter active links and sort by order_index
  const activeLinks = links
    .filter(link => link.active)
    .sort((a, b) => a.order_index - b.order_index)

  // Função para verificar se é link externo
  const isExternalLink = (path: string) => {
    return path.startsWith('http://') || path.startsWith('https://')
  }

  return (
    <Card className="border-red-200">
      <CardContent className="p-4 space-y-3">
        {activeLinks.map((link) => {
          const url = isExternalLink(link.path) ? link.path : `${origin}${link.path}`
          const key = link.id
          const msg = link.message || `Acompanhe ${link.label} na Plataforma PT RJ`
          
          // Se for link externo, mostrar preview
          if (isExternalLink(link.path)) {
            return (
              <div key={key} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-md p-2">
                  <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                    <Share2 className={`h-4 w-4 ${link.color}`} /> {link.label}
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
                <ExternalLinkPreview url={url} title={link.label} />
              </div>
            )
          }
          
          // Link interno - mostrar normalmente
          return (
            <div key={key} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border rounded-md p-2">
              <div className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <Share2 className={`h-4 w-4 ${link.color}`} /> {link.label}
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
        {activeLinks.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            Nenhum link de compartilhamento disponível.
          </div>
        )}
      </CardContent>
    </Card>
  )
}


