(async () => {
	const { createClient } = await import('@supabase/supabase-js')
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const service = process.env.SUPABASE_SERVICE_ROLE_KEY
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	if (!url || !(service || anon)) {
		console.error('Missing env vars: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or anon + SEED_EMAIL/SEED_PASSWORD)')
		process.exit(1)
	}
	const client = createClient(url, service || anon)

	if (!service && process.env.SEED_EMAIL && process.env.SEED_PASSWORD) {
		const { error: authErr } = await client.auth.signInWithPassword({
			email: process.env.SEED_EMAIL,
			password: process.env.SEED_PASSWORD,
		})
		if (authErr) {
			console.error('Auth failed:', authErr.message)
			process.exit(1)
		}
	}

	// Helpers
	async function insertMissing(table, key, items) {
		const { data: existing, error: fetchErr } = await client.from(table).select(key)
		if (fetchErr) {
			console.error(`Fetch existing error for ${table}:`, fetchErr.message)
			process.exit(1)
		}
		const set = new Set((existing || []).map((r) => r[key]))
		const toInsert = items.filter((i) => !set.has(i[key]))
		if (toInsert.length === 0) return { inserted: [] }
		const { data, error } = await client.from(table).insert(toInsert).select('*')
		if (error) {
			console.error(`Insert error for ${table}:`, error.message)
			process.exit(1)
		}
		return { inserted: data }
	}

	// Seed data
	const events = [
		{ title: 'Hackathon: Soluções para a Cidade', description: '48h criando apps e soluções para problemas urbanos', event_date: new Date().toISOString(), location: 'UFRJ - Fundão', category: 'Tecnologia', participants: 45, max_participants: 60, event_type: 'Presencial', organizer: 'Coletivo Tech Jovem', active: true },
		{ title: 'Debate: Juventude e Mercado de Trabalho', description: 'Desemprego jovem e políticas públicas de emprego', event_date: new Date(Date.now()+3*24*3600*1000).toISOString(), location: 'Online via Zoom', category: 'Debate', participants: 78, max_participants: 100, event_type: 'Online', organizer: 'Núcleo Juventude PT RJ', active: true },
	]
	const mentorships = [
		{ title: 'Liderança Política', description: 'Habilidades de liderança e gestão pública', duration: '6 meses', mentors: 8, mentees: 24, next_cohort: 'Março 2024', level: 'Intermediário', active: true },
		{ title: 'Comunicação e Mídia', description: 'Estratégias de comunicação política', duration: '4 meses', mentors: 5, mentees: 15, next_cohort: 'Fevereiro 2024', level: 'Iniciante', active: true },
	]
	const groups = [
		{ name: 'Juventude e Meio Ambiente', members: 45, last_activity: '2h atrás', topic: 'Energia renovável', color: 'green', active: true },
		{ name: 'Feminismo Jovem', members: 67, last_activity: '5h atrás', topic: 'Igualdade salarial', color: 'purple', active: true },
	]
	const leaders = [
		{ name: 'Ana Silva', role: 'Coordenadora Juventude', age: 24, focus: 'Educação Popular', image_url: null, active: true },
		{ name: 'Carlos Santos', role: 'Líder Estudantil', age: 22, focus: 'Movimento Estudantil', image_url: null, active: true },
	]
	const opportunities = [
		{ title: 'Estágio Político', description: 'Gabinete Deputado Estadual', org: 'ALERJ', deadline: new Date(Date.now()+15*24*3600*1000).toISOString().slice(0,10), opportunity_type: 'Estágio', active: true },
		{ title: 'Bolsa Formação', description: 'Curso de Gestão Pública', org: 'Escola PT', deadline: new Date(Date.now()+25*24*3600*1000).toISOString().slice(0,10), opportunity_type: 'Bolsa', active: true },
	]

	await insertMissing('youth_events', 'title', events)
	await insertMissing('youth_mentorships', 'title', mentorships)
	await insertMissing('youth_groups', 'name', groups)
	await insertMissing('youth_leaders', 'name', leaders)
	await insertMissing('youth_opportunities', 'title', opportunities)

	console.log('Youth seed completed.')
	process.exit(0)
})() 