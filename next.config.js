const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
  },
  webpack: (config) => {
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }

    config.resolve.fallback = {
      ...config.resolve.fallback,
      // Provide a fallback for the stream module
      stream: require.resolve("stream-browserify"),
      crypto: require.resolve("crypto-browserify"),
    };

    return config;
  },
};

module.exports = nextConfig;
