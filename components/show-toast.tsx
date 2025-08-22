"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export function ShowToast({ message }: { message?: string }) {
  const { toast } = useToast()
  useEffect(() => {
    if (message && typeof window !== "undefined") {
      toast({ title: message })
    }
  }, [message, toast])
  return null
} 