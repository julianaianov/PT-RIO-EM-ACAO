"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter } from "lucide-react"

const categories = [
  { id: "feminista", label: "Feminista", count: 12 },
  { id: "negro", label: "Movimento Negro", count: 8 },
  { id: "lgbtqia", label: "LGBTQIA+", count: 6 },
  { id: "sindical", label: "Sindical", count: 15 },
  { id: "estudantil", label: "Estudantil", count: 9 },
  { id: "ambiental", label: "Ambiental", count: 7 },
  { id: "habitacao", label: "Habitação", count: 5 },
  { id: "juventude", label: "Juventude", count: 11 },
]

const regions = [
  { id: "zona-norte", label: "Zona Norte", count: 18 },
  { id: "zona-sul", label: "Zona Sul", count: 8 },
  { id: "zona-oeste", label: "Zona Oeste", count: 12 },
  { id: "centro", label: "Centro", count: 6 },
  { id: "baixada", label: "Baixada Fluminense", count: 14 },
  { id: "niteroi", label: "Niterói", count: 4 },
]

export function MovementsFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleRegionChange = (regionId: string, checked: boolean) => {
    if (checked) {
      setSelectedRegions([...selectedRegions, regionId])
    } else {
      setSelectedRegions(selectedRegions.filter((id) => id !== regionId))
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategories([])
    setSelectedRegions([])
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Nome do movimento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Categories Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Categorias
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm cursor-pointer">
                  {category.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">({category.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Regions Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-800">Regiões</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {regions.map((region) => (
            <div key={region.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={region.id}
                  checked={selectedRegions.includes(region.id)}
                  onCheckedChange={(checked) => handleRegionChange(region.id, checked as boolean)}
                />
                <Label htmlFor={region.id} className="text-sm cursor-pointer">
                  {region.label}
                </Label>
              </div>
              <span className="text-xs text-gray-500">({region.count})</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
        Limpar Filtros
      </Button>
    </div>
  )
}
