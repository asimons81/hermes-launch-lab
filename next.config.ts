import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/services', destination: '/pricing', permanent: true },
    ]
  },
}

export default nextConfig
