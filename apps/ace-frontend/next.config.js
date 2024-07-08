/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src", "cypress/e2e"],
  },
  images: {
    domains: [
      "replicate.delivery",
      "cdn.dsmcdn.com",
      "jlagfwohjpobvgccpznu.supabase.co",
    ],
  },
};

module.exports = nextConfig;
