import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mammoth"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.wattpad.com",
        pathname: "/cover/**",
      },
    ],
  },
};

export default nextConfig;
