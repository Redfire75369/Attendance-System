module.exports = {
	webpack: (config, options) => {
		const {buildId, dev, isServer, defaultLoaders, webpack} = options;

		if (!isServer) {
			config.node = {
				fs: 'empty'
			}
		}

		config.externals = {
			sqlite3: "sqlite3"
		}

		return config;
	}
}
