"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase as browser } from "@/lib/supabase/client"

function getInitials(name?: string) {
	if (!name) return "?"
	const parts = name.split(" ").filter(Boolean)
	return (parts[0]?.[0] || "").concat(parts[1]?.[0] || "").toUpperCase()
}

function podiumGradient(idx: number) {
	if (idx === 0) return "from-yellow-200 via-rose-100 to-red-200"
	if (idx === 1) return "from-gray-100 via-gray-200 to-gray-300"
	return "from-amber-100 via-orange-100 to-orange-200"
}

function ringColor(idx: number) {
	if (idx === 0) return "ring-yellow-400"
	if (idx === 1) return "ring-gray-300"
	return "ring-amber-400"
}

export default function LeaderboardClient({ initial }: { initial: any[] }) {
	const [rows, setRows] = useState(initial)
	const [changedId, setChangedId] = useState<string | null>(null)
	useEffect(() => {
		const channel = browser.channel("leaderboard")
			.on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (payload) => {
				const updated = payload.new as any
				setRows((prev) => {
					const has = prev.some((p) => p.id === updated.id)
					const next = has ? prev.map((p) => (p.id === updated.id ? { ...p, points: updated.points, full_name: updated.full_name, avatar_url: updated.avatar_url } : p)) : [...prev, updated]
					return next.sort((a, b) => (b.points || 0) - (a.points || 0)).slice(0, 100)
				})
				setChangedId(String(updated.id))
				setTimeout(() => setChangedId((cur) => (cur === String(updated.id) ? null : cur)), 1200)
			})
			.subscribe()
		return () => { browser.removeChannel(channel) }
	}, [])

	const top3 = rows.slice(0, 3)
	const rest = rows.slice(3)
	const maxPoints = useMemo(() => Math.max(1, ...rows.map((r) => Number(r.points) || 0)), [rows])

	return (
		<div className="space-y-5">
			{/* Podium responsive */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
				{top3.map((u, idx) => (
					<div
						key={u.id}
						className={
							`relative rounded-2xl p-3 text-center shadow-sm ring-1 ring-red-100/60 backdrop-blur bg-gradient-to-br ${podiumGradient(idx)} 
							hover:shadow-md transition-all ${idx===0? 'pt-4 sm:h-40':'pt-3 sm:h-32'} ${idx===0? 'sm:order-2':'sm:order-'+(idx===1? '1':'3')} ${changedId===u.id? 'animate-pulse':''}`
						}
					>
						{/* medal */}
						<div className="absolute -top-2 left-1/2 -translate-x-1/2">
							{idx===0 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-400/90 text-yellow-900 shadow">1º</span>}
							{idx===1 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-300/90 text-gray-900 shadow">2º</span>}
							{idx===2 && <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-300/90 text-amber-900 shadow">3º</span>}
						</div>
						<div className="flex justify-center mb-1.5 mt-1">
							{u.avatar_url ? (
								<img src={u.avatar_url} alt={u.full_name || 'Usuário'} className={`rounded-full object-cover ring-2 ${ringColor(idx)} ${idx===0? 'w-16 h-16':'w-14 h-14'}`} />
							) : (
								<div className={`rounded-full bg-red-600 text-white flex items-center justify-center font-bold ring-2 ${ringColor(idx)} ${idx===0? 'w-16 h-16 text-base':'w-14 h-14 text-sm'}`}>{getInitials(u.full_name)}</div>
							)}
						</div>
						<div className="font-medium text-gray-800 text-sm truncate px-2">{u.full_name || 'Usuário'}</div>
						<div className="text-red-700 font-bold text-sm">{u.points || 0} pts</div>
					</div>
				))}
			</div>

			{/* List with progress effect */}
			<div className="rounded-xl ring-1 ring-red-100/70 bg-white/60 backdrop-blur divide-y">
				{rest.map((u, i) => {
					const pct = Math.min(100, Math.round(((Number(u.points) || 0) / maxPoints) * 100))
					return (
						<div key={u.id} className={`relative flex items-center justify-between px-3 py-2 overflow-hidden hover:bg-white/70 transition-colors ${changedId===u.id? 'animate-pulse':''}`}>
							<div className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-100/70 via-rose-100/70 to-red-200/70 pointer-events-none" style={{ width: pct + '%' }} />
							<div className="flex items-center gap-3 min-w-0 relative">
								<span className="text-gray-500 w-5 text-right text-xs">{i+4}</span>
								{u.avatar_url ? (
									<img src={u.avatar_url} alt={u.full_name || 'Usuário'} className="w-7 h-7 rounded-full object-cover ring-1 ring-red-300" />
								) : (
									<div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-bold ring-1 ring-red-300">{getInitials(u.full_name)}</div>
								)}
								<span className="truncate text-gray-800 text-sm">{u.full_name || 'Usuário'}</span>
							</div>
							<div className="text-red-700 font-semibold text-sm relative">{u.points || 0} pts</div>
						</div>
					)
				})}
				{rest.length === 0 && (
					<div className="px-3 py-2 text-xs text-gray-600">Sem mais participantes.</div>
				)}
			</div>
		</div>
	)
} 