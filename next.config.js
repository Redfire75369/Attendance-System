const nextRuntimeDotenv = require('next-runtime-dotenv')

const withConfig = nextRuntimeDotenv({
	path: '.env',
	public: [
		'SUPABASE_URL',
		'SUPABASE_ANON_KEY'
	],
	server: [
		'SUPABASE_ADMIN_KEY'
	]
})

module.exports = withConfig({
	future: {
		webpack5: true
	},
	webpack: (config, options) => {
		const {buildId, dev, isServer, defaultLoaders, webpack} = options;

		return config;
	}
});
