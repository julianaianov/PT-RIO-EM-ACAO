"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const eventTypes = [
  { value: "meeting", label: "Reunião" },
  { value: "course", label: "Curso" },
  { value: "protest", label: "Ato Público" },
  { value: "social", label: "Social" },
  { value: "campaign", label: "Campanha" },
]

const cities = [
  "Rio de Janeiro",
  "Niterói",
  "São Gonçalo",
  "Duque de Caxias",
  "Nova Iguaçu",
  "Belford Roxo",
  "São João de Meriti",
]

const neighborhoods = [
  "Centro",
  "Copacabana",
  "Ipanema",
  "Leblon",
  "Barra da Tijuca",
  "Tijuca",
  "Vila Isabel",
  "Maracanã",
  "Botafogo",
  "Flamengo",
  "Santa Teresa",
  "Lapa",
  "Zona Norte",
  "Zona Oeste",
]

export default function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCity = searchParams.get("city")
  const currentNeighborhood = searchParams.get("neighborhood")
  const currentType = searchParams.get("type")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/events?${params.toString()}`)
  }

  const clearAllFilters = () => {
    router.push("/events")
  }

  const hasActiveFilters = currentCity || currentNeighborhood || currentType

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Filtros</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Filtros ativos:</p>
            <div className="flex flex-wrap gap-2">
              {currentCity && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentCity}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("city", null)} />
                </Badge>
              )}
              {currentNeighborhood && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentNeighborhood}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("neighborhood", null)} />
                </Badge>
              )}
              {currentType && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {eventTypes.find((t) => t.value === currentType)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("type", null)} />
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* City Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Cidade</label>
          <Select value={currentCity || "all"} onValueChange={(value) => updateFilter("city", value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Neighborhood Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Bairro</label>
          <Select
            value={currentNeighborhood || "all"}
            onValueChange={(value) => updateFilter("neighborhood", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todos os bairros" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os bairros</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Tipo de Evento</label>
          <Select value={currentType || "all"} onValueChange={(value) => updateFilter("type", value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
