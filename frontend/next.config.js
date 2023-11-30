/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/explore',
            destination: '/Explore',
          },
        ]
      }
}

module.exports = nextConfig
