"use client";

import { useGateway } from "@/contexts/gateway-context";

export default function HomePage() {
  const { connected } = useGateway();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>首页</h1>
      <p style={{ color: "var(--text-secondary)" }}>欢迎回来，这里是您的工作空间</p>
      <p>Gateway 状态: {connected ? "已连接" : "未连接"}</p>
    </div>
  );
}
