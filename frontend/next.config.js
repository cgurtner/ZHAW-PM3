/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/explore',
            destination: '/Explore',
          },
        ]
      },
      output: 'standalone'
}

module.exports = nextConfig
