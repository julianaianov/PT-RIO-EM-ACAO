"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter()
  function handleClick() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
    } else {
      window.location.href = fallback
    }
  }
  return (
    <Button variant="ghost" type="button" onClick={handleClick}>
      <ArrowLeft className="h-4 w-4 mr-2" /> Voltar
    </Button>
  )
} 