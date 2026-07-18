import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin to this app directory (not C:\Users\lenovo from orphan lockfile)
    root: process.cwd(),
  },
};

export default nextConfig;
