const nextRuntimeDotenv = require("next-runtime-dotenv");
const path = require("path");

const withConfig = nextRuntimeDotenv({
	path: ".env",
	public: [
		"SUPABASE_URL",
		"SUPABASE_ANON_KEY"
	],
	server: [
		"SUPABASE_ADMIN_KEY"
	]
})

module.exports = withConfig({
	sassOptions: {
		includePaths: [
			path.join(__dirname, "stylesheets")
		],
	},
	webpack: (config, options) => {
		const {buildId, dev, isServer, defaultLoaders, webpack} = options;

		return config;
	}
});
