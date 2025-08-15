"use client"

import { Button } from "@/components/ui/button"
import { Share2, Copy, Check } from "lucide-react"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

interface NewsShareProps {
  news: any
}

export default function NewsShare({ news }: NewsShareProps) {
  const [copied, setCopied] = useState(false)

  const shareOnWhatsApp = () => {
    const message = `🔴 *${news.title}*\n\n${news.summary}\n\nLeia mais: ${window.location.href}\n\n#PTRJ #PartidoDosTrabalhadores`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  const shareOnTelegram = () => {
    const message = `🔴 ${news.title}\n\n${news.summary}\n\nLeia mais: ${window.location.href}`
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`
    window.open(telegramUrl, "_blank")
  }

  const shareOnFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
    window.open(facebookUrl, "_blank")
  }

  const shareOnTwitter = () => {
    const message = `${news.title}\n\n${news.summary}\n\n#PTRJ #PartidoDosTrabalhadores`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`
    window.open(twitterUrl, "_blank")
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      })
    }
  }

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-3">
      {/* Native Share (mobile) */}
      {navigator.share && (
        <Button variant="outline" onClick={shareNative}>
          <Share2 className="h-4 w-4 mr-2" />
          Compartilhar
        </Button>
      )}

      {/* WhatsApp */}
      <Button variant="outline" onClick={shareOnWhatsApp} className="bg-green-50 hover:bg-green-100">
        <span className="mr-2">📱</span>
        WhatsApp
      </Button>

      {/* Telegram */}
      <Button variant="outline" onClick={shareOnTelegram} className="bg-blue-50 hover:bg-blue-100">
        <span className="mr-2">✈️</span>
        Telegram
      </Button>

      {/* Facebook */}
      <Button variant="outline" onClick={shareOnFacebook} className="bg-blue-50 hover:bg-blue-100">
        <span className="mr-2">📘</span>
        Facebook
      </Button>

      {/* Twitter */}
      <Button variant="outline" onClick={shareOnTwitter} className="bg-sky-50 hover:bg-sky-100">
        <span className="mr-2">🐦</span>
        Twitter
      </Button>

      {/* Copy Link */}
      <Button variant="outline" onClick={copyLink}>
        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
        {copied ? "Copiado!" : "Copiar Link"}
      </Button>
    </div>
  )
}
