/** @type {import('next').NextConfig} */
// reactStrictMode: false — in dev mode, React Strict Mode causes double rendering of components,
// leading to duplicate useEffect calls, API requests, and other side effects.
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: process.env.NODE_ENV === 'development',
    },
  },
  allowedDevOrigins: ['site-boilerplate.narasim.dev.localhost'],
}

module.exports = nextConfig
