/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	swcMinify: true,

	webpack: (config) => {
		config.module.rules.push({
			test: /\.lottie$/,
			type: "asset/resource",
		});
		config.resolve.alias.canvas = false;

		return config;
	},

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "corsproxy.io",
			},
			{
				protocol: "https",
				hostname: "r2.studyjom.nrmnqdds.com",
			},
		],
	},

	logging: {
		fetches: {
			fullUrl: true,
		},
	},
};

export default nextConfig;
