import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@markazi/ui", "@markazi/api", "@markazi/auth", "@markazi/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.markazi.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@markazi/ui"],
  },
};

export default withNextIntl(nextConfig);
