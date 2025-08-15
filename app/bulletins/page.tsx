import WeeklyBulletin from "@/components/weekly-bulletin"

export default function BulletinsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Boletins Semanais</h1>
        <p className="text-muted-foreground">Acompanhe o resumo semanal das atividades e ações do PT RJ</p>
      </div>

      <WeeklyBulletin />
    </div>
  )
}
