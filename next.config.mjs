/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    allowedDevOrigins: ["172.18.2.9:3000", "localhost:3000"]
  }
};

export default nextConfig;