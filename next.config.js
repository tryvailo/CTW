/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG будет работать автоматически через generateStaticParams
  // output: 'export' не нужен для Vercel деплоя
  
  // Turbopack configuration for Next.js 16
  turbopack: {},
}

export default nextConfig

