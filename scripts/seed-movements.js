(async () => {
	const { createClient } = await import('@supabase/supabase-js')

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	const service = process.env.SUPABASE_SERVICE_ROLE_KEY
	if (!url || !(anon || service)) {
		console.error('Missing env vars: set NEXT_PUBLIC_SUPABASE_URL and either NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY')
		process.exit(1)
	}

	const client = createClient(url, service || anon)

	// If using anon key, sign in with a coordinator/admin to satisfy RLS
	const seedEmail = process.env.SEED_EMAIL
	const seedPassword = process.env.SEED_PASSWORD
	let userId = null
	if (!service && seedEmail && seedPassword) {
		const { data, error } = await client.auth.signInWithPassword({ email: seedEmail, password: seedPassword })
		if (error) {
			console.error('Auth failed:', error.message)
			process.exit(1)
		}
		userId = data.user?.id || null
	}

	const movements = [
		{
			name: 'Coletivo Feminista Dandara',
			description:
				'Movimento feminista popular que atua na zona norte do Rio, promovendo formação política e ações de combate à violência contra a mulher.',
			category: 'Feminista',
			region: 'Zona Norte',
			members: 150,
			founded: '2018',
			contact_whatsapp: '21999887766',
			contact_instagram: '@dandara_feminista',
			contact_facebook: 'DandaraFeminista',
			image_url: 'https://via.placeholder.com/600x400',
			created_by: userId,
		},
		{
			name: 'Movimento Negro Unificado RJ',
			description:
				'Organização histórica do movimento negro brasileiro, atuando na luta antirracista e pela igualdade racial no Rio de Janeiro.',
			category: 'Movimento Negro',
			region: 'Centro',
			members: 300,
			founded: '1978',
			contact_whatsapp: '21988776655',
			contact_instagram: '@mnu_rj',
			contact_facebook: 'MNURioDeJaneiro',
			image_url: 'https://via.placeholder.com/600x400',
			created_by: userId,
		},
		{
			name: 'Coletivo LGBTQIA+ Resistência',
			description:
				'Coletivo que luta pelos direitos da população LGBTQIA+ no Rio, organizando ações de visibilidade e combate à LGBTfobia.',
			category: 'LGBTQIA+',
			region: 'Zona Sul',
			members: 80,
			founded: '2020',
			contact_whatsapp: '21977665544',
			contact_instagram: '@resistencia_lgbtqia',
			contact_facebook: 'ResistenciaLGBTQIA',
			image_url: 'https://via.placeholder.com/600x400',
			created_by: userId,
		},
		{
			name: 'Sindicato dos Metalúrgicos RJ',
			description:
				'Sindicato que representa os trabalhadores metalúrgicos do Rio de Janeiro, lutando por melhores condições de trabalho e salários dignos.',
			category: 'Sindical',
			region: 'Zona Oeste',
			members: 2500,
			founded: '1985',
			contact_whatsapp: '21966554433',
			contact_instagram: '@metalurgicos_rj',
			contact_facebook: 'MetalurgicosRJ',
			image_url: 'https://via.placeholder.com/600x400',
			created_by: userId,
		},
	]

	const { data, error } = await client.from('movements').insert(movements).select('id, name')
	if (error) {
		console.error('Insert error:', error.message)
		process.exit(1)
	}
	console.log('Seeded movements:', data)
	process.exit(0)
})() 