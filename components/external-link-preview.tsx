"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Eye, EyeOff } from "lucide-react"

interface ExternalLinkPreviewProps {
  url: string
  title?: string
}

export default function ExternalLinkPreview({ url, title }: ExternalLinkPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(true) // Sempre visível por padrão
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função para determinar o tipo de embed baseado na URL
  const getEmbedType = (url: string) => {
    if (url.includes('instagram.com')) {
      return 'instagram'
    }
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube'
    }
    if (url.includes('facebook.com')) {
      return 'facebook'
    }
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return 'twitter'
    }
    if (url.includes('tiktok.com')) {
      return 'tiktok'
    }
    return 'iframe'
  }

  const embedType = getEmbedType(url)

  // Função para gerar URL de embed
  const getEmbedUrl = (url: string, type: string) => {
    switch (type) {
      case 'instagram':
        // Converter URL do Instagram para embed
        const instagramMatch = url.match(/instagram\.com\/p\/([^\/\?]+)/)
        if (instagramMatch) {
          return `https://www.instagram.com/p/${instagramMatch[1]}/embed/`
        }
        // Para perfis do Instagram
        const profileMatch = url.match(/instagram\.com\/([^\/\?]+)/)
        if (profileMatch) {
          return `https://www.instagram.com/${profileMatch[1]}/embed/`
        }
        return url
      
      case 'youtube':
        // Converter URL do YouTube para embed
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n]+)/)
        if (youtubeMatch) {
          return `https://www.youtube.com/embed/${youtubeMatch[1]}`
        }
        return url
      
      case 'facebook':
        // Converter URL do Facebook para embed
        return url.replace('www.facebook.com', 'www.facebook.com/plugins/post.php?href=') + '&show_text=true&width=500'
      
      case 'twitter':
        // Converter URL do Twitter para embed
        return url.replace('twitter.com', 'platform.twitter.com/widgets/tweet.html?url=') + '&text=' + encodeURIComponent(title || '')
      
      default:
        return url
    }
  }

  const embedUrl = getEmbedUrl(url, embedType)

  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4 text-red-600" />
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-medium text-gray-700 hover:text-red-600 hover:underline"
            >
              {title || 'Link Externo'}
            </a>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs"
          >
            {isExpanded ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
            {isExpanded ? 'Ocultar' : 'Mostrar'}
          </Button>
        </div>

        <div className="text-xs text-gray-500 mb-3 break-all">
          {url}
        </div>

        {isExpanded && (
          <div className="mt-4">
            {embedType === 'instagram' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  scrolling="no"
                  allowTransparency={true}
                  className="rounded"
                />
              </div>
            )}

            {embedType === 'youtube' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="315"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded"
                />
              </div>
            )}

            {embedType === 'facebook' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded"
                />
              </div>
            )}

            {embedType === 'twitter' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <iframe
                  src={embedUrl}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  className="rounded"
                />
              </div>
            )}

            {embedType === 'iframe' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <iframe
                  src={url}
                  width="100%"
                  height="400"
                  frameBorder="0"
                  className="rounded"
                  onLoad={() => setIsLoading(false)}
                  onError={() => {
                    setError('Não foi possível carregar o conteúdo')
                    setIsLoading(false)
                  }}
                />
                {isLoading && (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-gray-500">Carregando...</div>
                  </div>
                )}
                {error && (
                  <div className="flex items-center justify-center h-40">
                    <div className="text-red-500">{error}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
