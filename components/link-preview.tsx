interface LinkPreviewProps {
  links: string[]
}

export default function LinkPreview({ links }: LinkPreviewProps) {
  const uniqueLinks = Array.from(new Set(links.filter(Boolean)))
  if (uniqueLinks.length === 0) return null

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {uniqueLinks.map((url) => {
        let hostname = url
        try {
          hostname = new URL(url).hostname
        } catch {}
        const favicon = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(url)}&sz=64`
        return (
          <div key={url} className="rounded-lg border overflow-hidden bg-white">
            <div className="p-3 flex items-center gap-3 border-b">
              <img src={favicon} alt="" className="w-5 h-5" />
              <div className="text-sm text-muted-foreground truncate">{hostname}</div>
            </div>
            <div className="relative h-48 bg-muted">
              {/* Many news sites block iframes; if it fails, user still sees the header and can click the overlay */}
              <iframe
                src={url}
                className="absolute inset-0 w-full h-full"
                loading="lazy"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                referrerPolicy="no-referrer"
              />
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-red-600"
                aria-label={`Abrir link ${url}`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
} 