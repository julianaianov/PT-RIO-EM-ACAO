"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle } from "lucide-react"

export function AuthFeedback() {
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const error = searchParams.get("error")
    const message = searchParams.get("message")

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error,
      })
    }

    if (message) {
      toast({
        variant: "success",
        title: "Sucesso",
        description: message,
      })
    }
  }, [searchParams, toast])

  return null
} 