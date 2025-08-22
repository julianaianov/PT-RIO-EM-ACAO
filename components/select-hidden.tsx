"use client"

import { useRef } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export function SelectHidden({
  name,
  options,
  placeholder = "Selecione",
  defaultValue,
}: {
  name: string
  options: string[]
  placeholder?: string
  defaultValue?: string
}) {
  const hiddenRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <input ref={hiddenRef} type="hidden" name={name} defaultValue={defaultValue} />
      <Select defaultValue={defaultValue} onValueChange={(value) => { if (hiddenRef.current) hiddenRef.current.value = value }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
} 