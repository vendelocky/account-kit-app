/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    images: {
        domains: ['gateway.pinata.cloud'],
        unoptimized: true,
    }
};

export default nextConfig;
