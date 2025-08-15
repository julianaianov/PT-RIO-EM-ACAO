"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, MapPin, Calendar, MessageCircle, Instagram, Facebook, Mail, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Mock data - in real app, fetch based on params.id
const mockMovement = {
  id: 1,
  name: "Coletivo Feminista Dandara",
  description:
    "O Coletivo Feminista Dandara é um movimento feminista popular que atua na zona norte do Rio de Janeiro desde 2018. Nosso trabalho se concentra na formação política de mulheres, no combate à violência doméstica e na promoção da igualdade de gênero em nossas comunidades.",
  fullDescription: `
    Nascido da necessidade de organizar as mulheres trabalhadoras da zona norte do Rio, o Coletivo Dandara se inspira na luta histórica de Dandara dos Palmares. 
    
    Nossas principais atividades incluem:
    • Rodas de conversa sobre direitos das mulheres
    • Oficinas de formação política feminista
    • Campanhas contra a violência doméstica
    • Apoio jurídico e psicológico para mulheres em situação de vulnerabilidade
    • Articulação com outros movimentos sociais
    
    Acreditamos que a luta feminista é indissociável da luta de classes e trabalhamos para construir uma sociedade mais justa e igualitária para todas as mulheres.
  `,
  category: "Feminista",
  region: "Zona Norte",
  members: 150,
  founded: "2018",
  contact: {
    whatsapp: "21999887766",
    instagram: "@dandara_feminista",
    facebook: "DandaraFeminista",
    email: "contato@dandara.org.br",
    website: "www.dandara.org.br",
  },
  address: "Rua das Flores, 123 - Tijuca, Rio de Janeiro",
  meetingSchedule: "Toda segunda-feira às 19h",
  image: "/placeholder.svg?height=400&width=600",
  upcomingEvents: [
    {
      title: "Roda de Conversa - Violência Doméstica",
      date: "2024-01-20",
      time: "14:00",
      location: "Centro Comunitário da Tijuca",
    },
    {
      title: "Oficina de Formação Política",
      date: "2024-01-27",
      time: "10:00",
      location: "Sede do Coletivo",
    },
    {
      title: "Marcha das Mulheres",
      date: "2024-02-08",
      time: "16:00",
      location: "Praça Saens Peña",
    },
  ],
}

export default function MovementDetailPage() {
  const joinWhatsApp = () => {
    const message = `Olá! Gostaria de saber mais sobre o ${mockMovement.name} e como posso participar.`
    const whatsappUrl = `https://wa.me/55${mockMovement.contact.whatsapp}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Back Button */}
        <Link href="/movements">
          <Button variant="outline" className="mb-6 bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Movimentos
          </Button>
        </Link>

        {/* Hero Section */}
        <Card className="mb-8 border-red-200">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={mockMovement.image || "/placeholder.svg"}
                alt={mockMovement.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-t-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <Badge className="mb-2 bg-red-600">{mockMovement.category}</Badge>
                <h1 className="text-3xl font-bold">{mockMovement.name}</h1>
                <p className="text-red-100">{mockMovement.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Sobre o Movimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {mockMovement.fullDescription.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700 whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMovement.upcomingEvents.map((event, index) => (
                    <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-800">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString("pt-BR")} às {event.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-red-600" />
                  <span>{mockMovement.members} membros</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-red-600" />
                  <span>Fundado em {mockMovement.founded}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-red-600" />
                  <span>{mockMovement.region}</span>
                </div>
                <div className="text-sm">
                  <strong>Reuniões:</strong> {mockMovement.meetingSchedule}
                </div>
                <div className="text-sm">
                  <strong>Endereço:</strong> {mockMovement.address}
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-800">Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={joinWhatsApp} className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Instagram className="h-3 w-3 mr-1" />
                    Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Facebook className="h-3 w-3 mr-1" />
                    Facebook
                  </Button>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-red-600" />
                    <span>{mockMovement.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-red-600" />
                    <span>{mockMovement.contact.website}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Join Movement */}
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <h3 className="font-semibold text-red-800 mb-2">Quer Participar?</h3>
                <p className="text-sm text-red-600 mb-4">
                  Junte-se à nossa luta por uma sociedade mais justa e igualitária.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">Quero Participar</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
