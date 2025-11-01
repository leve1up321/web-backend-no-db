/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb', 'bcryptjs', 'jsonwebtoken'],
  env: {
    ZIINA_SECRET_KEY: process.env.ZIINA_SECRET_KEY,
    ZIINA_WEBHOOK_SECRET: process.env.ZIINA_WEBHOOK_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
    DATABASE_URL: process.env.DATABASE_URL
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-ziina-signature' }
        ]
      }
    ]
  }
}

export default nextConfig
