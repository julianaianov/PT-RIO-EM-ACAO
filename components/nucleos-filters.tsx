"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"
import { useState } from "react"

const cities = [
  "Rio de Janeiro",
  "Niterói",
  "São Gonçalo",
  "Duque de Caxias",
  "Nova Iguaçu",
  "Belford Roxo",
  "São João de Meriti",
  "Magé",
  "Itaboraí",
  "Maricá",
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
  "Zona Sul",
  "Baixada Fluminense",
]

export default function NucleosFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const currentCity = searchParams.get("city")
  const currentNeighborhood = searchParams.get("neighborhood")
  const currentSearch = searchParams.get("search")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/nucleos?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter("search", searchTerm || null)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    router.push("/nucleos")
  }

  const hasActiveFilters = currentCity || currentNeighborhood || currentSearch

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
        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <Input placeholder="Buscar núcleos..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Button type="submit" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

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
              {currentSearch && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  "{currentSearch}"
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("search", null)} />
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
          <label className="text-sm font-medium mb-2 block">Região</label>
          <Select
            value={currentNeighborhood || "all"}
            onValueChange={(value) => updateFilter("neighborhood", value || null)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              {neighborhoods.map((neighborhood) => (
                <SelectItem key={neighborhood} value={neighborhood}>
                  {neighborhood}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Access */}
        <div>
          <p className="text-sm font-medium mb-2">Acesso rápido:</p>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("city", "Rio de Janeiro")}
            >
              🏙️ Rio de Janeiro
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("city", "Niterói")}
            >
              🌊 Niterói
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("neighborhood", "Baixada Fluminense")}
            >
              🏘️ Baixada Fluminense
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
