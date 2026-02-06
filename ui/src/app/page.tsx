"use client";

import { useTheme } from "next-themes";
import { useUIStore } from "@/store/use-ui-store";

export default function HomePage() {
  const { theme, setTheme } = useUIStore();
  const { setTheme: setNextTheme, resolvedTheme } = useTheme();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setNextTheme(newTheme);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <header
        style={{
          marginBottom: "2rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h1>涌现YongXian.xyz</h1>
        <p style={{ color: "var(--text-secondary)" }}>OpenClaw Control UI - Next.js 16</p>
      </header>

      <main style={{ maxWidth: "800px" }}>
        <section style={{ marginBottom: "2rem" }}>
          <h2>迁移状态</h2>
          <p>项目已成功迁移到 Next.js 16！</p>
          <ul style={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
            <li>✅ Next.js 16.1.6 项目创建完成</li>
            <li>✅ React 19.2.3 集成完成</li>
            <li>✅ Gateway 客户端核心代码迁移完成</li>
            <li>✅ 设备身份验证（Ed25519）迁移完成</li>
            <li>✅ Zustand 状态管理配置完成</li>
            <li>✅ next-themes 主题切换配置完成</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h2>主题切换</h2>
          <p style={{ marginBottom: "1rem" }}>当前主题: {resolvedTheme}</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => handleThemeChange("light")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme === "light" ? "var(--accent)" : "var(--bg-secondary)",
                color: theme === "light" ? "white" : "var(--text)",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              浅色
            </button>
            <button
              onClick={() => handleThemeChange("dark")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme === "dark" ? "var(--accent)" : "var(--bg-secondary)",
                color: theme === "dark" ? "white" : "var(--text)",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              深色
            </button>
            <button
              onClick={() => handleThemeChange("system")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: theme === "system" ? "var(--accent)" : "var(--bg-secondary)",
                color: theme === "system" ? "white" : "var(--text)",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              跟随系统
            </button>
          </div>
        </section>

        <section
          style={{
            marginBottom: "2rem",
            padding: "1.5rem",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "0.5rem",
          }}
        >
          <h2>下一步</h2>
          <p>继续迁移以下功能：</p>
          <ol style={{ marginLeft: "1.5rem", marginTop: "1rem" }}>
            <li>创建 Gateway 测试页面</li>
            <li>实现聊天界面</li>
            <li>迁移配置管理页面</li>
            <li>迁移频道管理页面</li>
            <li>迁移 AI 助理页面</li>
          </ol>
        </section>

        <section
          style={{
            padding: "1.5rem",
            backgroundColor: "var(--bg-tertiary)",
            borderRadius: "0.5rem",
          }}
        >
          <h2>Gateway 连接测试</h2>
          <p style={{ color: "var(--text-secondary)" }}>测试页面即将推出...</p>
          <button
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "var(--accent)",
              color: "white",
              borderRadius: "0.375rem",
              opacity: 0.6,
              cursor: "not-allowed",
            }}
            disabled
          >
            连接到 Gateway（即将推出）
          </button>
        </section>
      </main>

      <footer
        style={{
          marginTop: "3rem",
          paddingTop: "1rem",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        <p>迁移状态: 阶段 0 完成 ✅</p>
      </footer>
    </div>
  );
}
