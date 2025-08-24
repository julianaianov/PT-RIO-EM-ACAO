import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BackButton from "@/components/back-button"
import Link from "next/link"

export default async function SharePage() {
  const supabase = await createClient()
  const { data: items } = await supabase
    .from("share_items")
    .select("id, title, summary, image_url, target_url")
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-[calc(100vh-160px)] container mx-auto px-4 py-6">
      <div className="mb-4 text-white"><BackButton className="text-white hover:bg-white/10" /></div>
      <Card className="border-red-200 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardTitle>Conteúdos para Compartilhar</CardTitle>
        </CardHeader>
        <CardContent className="p-4 bg-white/70 space-y-4">
          <p className="text-sm text-gray-700">Veja conteúdos já publicados e compartilhe nas suas redes.</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {(items || []).map((n) => (
              <div key={n.id} className="border rounded-lg bg-white">
                {n.image_url ? (
                  <img src={n.image_url} alt={n.title} className="w-full h-32 object-cover rounded-t-lg" />
                ) : null}
                <div className="p-3">
                  <div className="font-semibold text-gray-900 line-clamp-2 mb-1">{n.title}</div>
                  <div className="text-sm text-gray-600 line-clamp-3 mb-3">{n.summary}</div>
                  <div className="flex gap-2">
                    <Button asChild size="sm" variant="outline" className="border-green-600 text-green-700">
                      <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${encodeURIComponent(`${n.title}\n\n${n.summary || ''}\n\n${n.target_url}`)}`}>WhatsApp</a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-blue-600 text-blue-700">
                      <a target="_blank" rel="noopener noreferrer" href={`https://t.me/share/url?url=${encodeURIComponent(n.target_url)}&text=${encodeURIComponent(n.title)}`}>Telegram</a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-sky-500 text-sky-600">
                      <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(n.title)}&url=${encodeURIComponent(n.target_url)}`}>Twitter</a>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="border-blue-800 text-blue-800">
                      <a target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(n.target_url)}`}>Facebook</a>
                    </Button>
                  </div>
                  <div className="mt-2">
                    {n.target_url?.startsWith("/") ? (
                      <Button asChild size="sm" className="bg-red-600 hover:bg-red-700"><Link href={n.target_url}>Ver na plataforma</Link></Button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
            {(!items || items.length === 0) && <div className="text-sm text-gray-600">Sem conteúdos publicados ainda.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


