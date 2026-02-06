import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 基础路径配置
  basePath: process.env.OPENCLAW_CONTROL_UI_BASE_PATH || "",

  // Turbopack 配置（Next.js 16 默认）
  turbopack: {
    // Turbopack 配置
  },
};

export default nextConfig;
