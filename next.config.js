/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: process.env.NODE_ENV === 'development',
    },
  },
  allowedDevOrigins: ['site-boilerplate.narasim.dev.localhost'],
}

module.exports = nextConfig
