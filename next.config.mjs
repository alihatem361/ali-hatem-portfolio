/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@emotion/is-prop-valid", "@emotion/memoize"],

  images: {
    remotePatterns: [
      // Sanity CDN — for all project images uploaded through the Studio
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/files/**",
      },
    ],
  },
};

export default nextConfig;
