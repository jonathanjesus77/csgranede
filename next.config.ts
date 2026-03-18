import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fastly.steamstatic.com",
        pathname: "/apps/csgo/maps/**",
      },
    ],
  },
};

export default nextConfig;
