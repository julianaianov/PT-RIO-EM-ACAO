"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Users, Calendar, BookOpen, Share2, UserPlus, Target, Gift, Award } from "lucide-react"

const MILITANT_LEVELS = [
  {
    id: 1,
    name: "Militante Iniciante",
    icon: "🌱",
    minPoints: 0,
    maxPoints: 99,
    title: "Base Ativa",
    benefits: ["Acesso básico a cursos e agenda"],
  },
  {
    id: 2,
    name: "Mobilizador de Bairro",
    icon: "🌿",
    minPoints: 100,
    maxPoints: 249,
    title: "Mobilizador",
    benefits: ["Prioridade na inscrição de eventos locais"],
  },
  {
    id: 3,
    name: "Formador Popular",
    icon: "🌳",
    minPoints: 250,
    maxPoints: 499,
    title: "Formador",
    benefits: ["Participa de reuniões ampliadas do núcleo"],
  },
  {
    id: 4,
    name: "Referência de Base",
    icon: "🔥",
    minPoints: 500,
    maxPoints: 999,
    title: "Líder Local",
    benefits: ["Acesso a encontros regionais e destaque no app"],
  },
  {
    id: 5,
    name: "Militante do Ano",
    icon: "⭐",
    minPoints: 1000,
    maxPoints: 9999,
    title: "Companheiro Destaque",
    benefits: ["Camiseta ou kit oficial + convite para evento estadual"],
  },
]

const POINT_ACTIONS = [
  { action: "Participar de evento presencial", points: 20, icon: Calendar },
  { action: "Confirmar presença e comparecer a plenária", points: 15, icon: Users },
  { action: "Concluir curso online de formação", points: 30, icon: BookOpen },
  { action: "Compartilhar evento oficial nas redes sociais", points: 10, icon: Share2 },
  { action: "Trazer um novo filiado", points: 40, icon: UserPlus },
  { action: "Participar de missão semanal", points: 25, icon: Target },
  { action: 'Criar proposta aprovada no "Espaço Juventude"', points: 35, icon: Star },
  { action: "Fazer doação voluntária", points: 15, icon: Gift },
]

export default function PointsPage() {
  const [userPoints, setUserPoints] = useState(245) // Mock data
  const [recentActions, setRecentActions] = useState([
    { id: 1, action: 'Concluiu curso "História do PT"', points: 30, date: "2024-01-15" },
    { id: 2, action: 'Participou do evento "Plenária Municipal"', points: 20, date: "2024-01-14" },
    { id: 3, action: "Compartilhou evento nas redes sociais", points: 10, date: "2024-01-13" },
  ])

  const getCurrentLevel = (points: number) => {
    return MILITANT_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints) || MILITANT_LEVELS[0]
  }

  const getNextLevel = (points: number) => {
    const currentLevelIndex = MILITANT_LEVELS.findIndex(
      (level) => points >= level.minPoints && points <= level.maxPoints,
    )
    return currentLevelIndex < MILITANT_LEVELS.length - 1 ? MILITANT_LEVELS[currentLevelIndex + 1] : null
  }

  const currentLevel = getCurrentLevel(userPoints)
  const nextLevel = getNextLevel(userPoints)
  const progressToNext = nextLevel
    ? ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-red-800">Sistema de Pontos PT RJ</h1>
          <p className="text-red-600">Reconhecendo seu engajamento e militância</p>
        </div>

        {/* Current Status Card */}
        <Card className="border-red-200 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="text-6xl mb-2">{currentLevel.icon}</div>
            <CardTitle className="text-2xl text-red-800">{currentLevel.name}</CardTitle>
            <CardDescription className="text-lg font-medium text-red-600">
              {currentLevel.title} • {userPoints} pontos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {nextLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso para {nextLevel.name}</span>
                  <span>{nextLevel.minPoints - userPoints} pontos restantes</span>
                </div>
                <Progress value={progressToNext} className="h-3" />
              </div>
            )}

            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">Seus Benefícios Atuais:</h4>
              <ul className="space-y-1">
                {currentLevel.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-red-700">
                    <Award className="h-4 w-4" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="actions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="actions">Como Ganhar Pontos</TabsTrigger>
            <TabsTrigger value="levels">Níveis de Militante</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {POINT_ACTIONS.map((item, index) => {
                const Icon = item.icon
                return (
                  <Card key={index} className="border-red-200 hover:border-red-300 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Icon className="h-5 w-5 text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.action}</p>
                          <Badge variant="secondary" className="bg-red-100 text-red-800">
                            +{item.points} pontos
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="levels" className="space-y-4">
            <div className="space-y-4">
              {MILITANT_LEVELS.map((level) => (
                <Card
                  key={level.id}
                  className={`border-2 ${
                    userPoints >= level.minPoints && userPoints <= level.maxPoints
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{level.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{level.name}</h3>
                        <p className="text-red-600 font-medium">{level.title}</p>
                        <p className="text-sm text-gray-600">
                          {level.minPoints} - {level.maxPoints === 9999 ? "∞" : level.maxPoints} pontos
                        </p>
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Benefícios:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {level.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      {userPoints >= level.minPoints && userPoints <= level.maxPoints && (
                        <Badge className="bg-red-600 text-white">Atual</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800">Atividades Recentes</CardTitle>
                <CardDescription>Suas últimas ações que geraram pontos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActions.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.date}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">+{activity.points} pontos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
