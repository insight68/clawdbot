import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 启用静态导出（生成纯静态文件）
  output: "export",

  // 输出目录：直接写到服务器期望的位置
  distDir: "../dist/control-ui",

  // 基础路径配置
  basePath: process.env.OPENCLAW_CONTROL_UI_BASE_PATH || "",
};

export default nextConfig;
