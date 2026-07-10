/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*"],
  async rewrites() {
    return [
      {
        source: "/sitemap/:state(\\w+(?:-\\d+)?)\\.xml",
        destination: "/sitemap/:state",
      },
    ];
  },
};

export default nextConfig;
