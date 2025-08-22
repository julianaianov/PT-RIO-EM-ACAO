"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

function sanitize(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_")
}

export default function CoverUploader({ hiddenInputName = "cover_uploaded_url" }: { hiddenInputName?: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  const onUpload = async () => {
    if (!file) {
      toast({ title: "Selecione uma imagem", variant: "destructive" })
      return
    }
    setUploading(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth.user) {
        toast({ title: "Login necessário", variant: "destructive" })
        return
      }
      const safeName = sanitize(file.name)
      const path = `${auth.user.id}/${Date.now()}-${safeName}`
      const buffer = await file.arrayBuffer()
      const { error } = await supabase.storage.from("course-files").upload(path, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      })
      if (error) throw error
      const { data } = supabase.storage.from("course-files").getPublicUrl(path)
      setUrl(data.publicUrl)
      toast({ title: "Capa enviada com sucesso" })
    } catch (e: any) {
      toast({ title: "Falha ao enviar a capa", description: String(e?.message || e), variant: "destructive" })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <div className="flex items-center gap-2">
        <Button type="button" onClick={onUpload} disabled={uploading} className="bg-red-600 hover:bg-red-700">
          {uploading ? "Enviando..." : "Upload da Capa"}
        </Button>
        {url && <span className="text-sm text-green-700">Pronto</span>}
      </div>
      {url && (
        <div className="mt-2">
          <img src={url} alt="Capa enviada" className="h-24 rounded border" />
          <input type="hidden" name={hiddenInputName} value={url} />
        </div>
      )}
    </div>
  )
} 