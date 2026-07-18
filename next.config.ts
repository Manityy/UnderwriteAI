import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid picking up C:\Users\lenovo\package-lock.json as the workspace root
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
