(async () => {
	const { createClient } = await import('@supabase/supabase-js')
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const service = process.env.SUPABASE_SERVICE_ROLE_KEY
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	if (!url || !(service || anon)) {
		console.error('Missing env vars: set NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY')
		process.exit(1)
	}
	const client = createClient(url, service || anon)

	// Sign-in fallback when using anon to satisfy RLS
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

	const items = [
		{ name: 'Frente Brasil Popular', partnership_type: 'Articulação Nacional', members_info: '120+ organizações', order_index: 1, active: true },
		{ name: 'Levante Popular da Juventude', partnership_type: 'Movimento Juvenil', members_info: '5.000+ jovens', order_index: 2, active: true },
		{ name: 'MST Rio de Janeiro', partnership_type: 'Movimento Rural', members_info: '2.000+ famílias', order_index: 3, active: true },
	]

	// Insert only missing by name
	const { data: existing, error: fetchErr } = await client
		.from('movement_partnerships')
		.select('name')
		.in('name', items.map((i) => i.name))

	if (fetchErr) {
		console.error('Fetch existing error:', fetchErr.message)
		process.exit(1)
	}

	const existingNames = new Set((existing || []).map((r) => r.name))
	const toInsert = items.filter((i) => !existingNames.has(i.name))

	if (toInsert.length === 0) {
		console.log('Nothing to insert. Partnerships already present.')
		process.exit(0)
	}

	const { data, error } = await client.from('movement_partnerships').insert(toInsert).select('id,name')
	if (error) {
		console.error('Insert error:', error.message)
		process.exit(1)
	}
	console.log('Seeded partnerships:', data)
	process.exit(0)
})() 