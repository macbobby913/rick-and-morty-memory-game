/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/rick-and-morty-memory-game",
  output: "export", // <=== enables static exports
  reactStrictMode: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "rickandmortyapi.com" }],
  },
};

module.exports = nextConfig;
