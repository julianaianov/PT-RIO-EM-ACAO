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
  { value: "history", label: "História" },
  { value: "politics", label: "Política" },
  { value: "economics", label: "Economia" },
  { value: "social", label: "Social" },
  { value: "campaign", label: "Campanha" },
]

const difficulties = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
]

export default function CoursesFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  const currentCategory = searchParams.get("category")
  const currentDifficulty = searchParams.get("difficulty")
  const currentSearch = searchParams.get("search")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/courses?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter("search", searchTerm || null)
  }

  const clearAllFilters = () => {
    setSearchTerm("")
    router.push("/courses")
  }

  const hasActiveFilters = currentCategory || currentDifficulty || currentSearch

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl">Filtros</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters}>
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch}>
          <div className="flex gap-2">
            <Input 
              placeholder="Buscar cursos..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm sm:text-base"
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
                <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                  {categories.find((c) => c.value === currentCategory)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("category", null)} />
                </Badge>
              )}
              {currentDifficulty && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
                  {difficulties.find((d) => d.value === currentDifficulty)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => updateFilter("difficulty", null)} />
                </Badge>
              )}
              {currentSearch && (
                <Badge variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
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
            <SelectTrigger className="text-sm sm:text-base">
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

        {/* Difficulty Filter */}
        <div>
          <label className="text-sm font-medium mb-2 block">Dificuldade</label>
          <Select
            value={currentDifficulty || "all"}
            onValueChange={(value) => updateFilter("difficulty", value || null)}
          >
            <SelectTrigger className="text-sm sm:text-base">
              <SelectValue placeholder="Todas as dificuldades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as dificuldades</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
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
              className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => updateFilter("category", "history")}
            >
              📚 História do PT
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => updateFilter("category", "politics")}
            >
              🏛️ Política Brasileira
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
              onClick={() => updateFilter("difficulty", "beginner")}
            >
              🌱 Para Iniciantes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
