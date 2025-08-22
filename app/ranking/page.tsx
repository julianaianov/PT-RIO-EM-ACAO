import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BackButton from "@/components/back-button"
import LeaderboardClient from "@/components/leaderboard-client"

export default async function RankingPage() {
	const supabase = await createClient()
	const { data: profiles } = await supabase
		.from("profiles")
		.select("id, full_name, avatar_url, points")
		.order("points", { ascending: false })
		.limit(100)

	return (
		<div className="container mx-auto px-4 py-6">
			<div className="mb-4 text-white"><BackButton fallback="/" /></div>
			<Card className="border-red-200 overflow-hidden">
				<CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
					<CardTitle>Ranking</CardTitle>
				</CardHeader>
				<CardContent className="p-4 bg-gradient-to-br from-red-50 to-white">
					<LeaderboardClient initial={profiles || []} />
				</CardContent>
			</Card>
		</div>
	)
} 