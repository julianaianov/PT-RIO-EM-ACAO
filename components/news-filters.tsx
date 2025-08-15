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

const categories = [
  { value: "politics", label: "Política" },
  { value: "campaign", label: "Campanha" },
  { value: "social", label: "Social" },
  { value: "formation", label: "Formação" },
  { value: "general", label: "Geral" },
]

const regions = [
  "Zona Sul",
  "Zona Norte",
  "Zona Oeste",
  "Centro",
  "Baixada Fluminense",
  "Niterói",
  "São Gonçalo",
  "Grande Rio",
]

export default function NewsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const currentCategory = searchParams.get("category")
  const currentRegion = searchParams.get("region")
  const currentSearch = searchParams.get("search")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/news?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter("search", searchTerm || null)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    router.push("/news")
  }

  const hasActiveFilters = currentCategory || currentRegion || currentSearch

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
            <Input
              placeholder="Buscar notícias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
              {currentCategory && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.value === currentCategory)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("category", null)} />
                </Badge>
              )}
              {currentRegion && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {currentRegion}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("region", null)} />
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

        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Categoria</label>
          <Select value={currentCategory || "all"} onValueChange={(value) => updateFilter("category", value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Região</label>
          <Select value={currentRegion || "all"} onValueChange={(value) => updateFilter("region", value || null)}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as regiões" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as regiões</SelectItem>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quick Categories */}
        <div>
          <p className="text-sm font-medium mb-2">Acesso rápido:</p>
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("category", "campaign")}
            >
              🔴 Campanhas
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("category", "formation")}
            >
              📚 Formação Política
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => updateFilter("category", "social")}
            >
              ✊ Movimentos Sociais
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
