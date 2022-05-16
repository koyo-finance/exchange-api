const { version } = require('./package.json');

module.exports = {
	publicRuntimeConfig: {
		version: version || '0.0.0'
	},
	async rewrites() {
		return [
			{
				source: '/:path*',
				destination: '/api/:path*'
			},
			{
				source: '/docs',
				destination: '/docs'
			}
		];
	}
};
