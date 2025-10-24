/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '10000',
                pathname: '/src/uploads/**',
            },
        ],
    },
}

export default nextConfig
