"use client";

import { useEffect, useState } from "react";

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  category: "approval" | "config" | "review" | "deploy";
}

export interface SkillUsage {
  id: string;
  name: string;
  icon: string;
  time: string;
  category: string;
}

export interface LastRunSummary {
  title: string;
  time: string;
  summary: string;
}

export interface FrequentTask {
  name: string;
  icon: string;
  desc: string;
  link: string;
}

export default function HomePage() {
  const [lastRun, setLastRun] = useState<LastRunSummary | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [topTask, setTopTask] = useState<FrequentTask | null>(null);
  const [recentSkills, setRecentSkills] = useState<SkillUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // TODO: 从 Gateway API 获取真实数据；当前使用模拟数据
      setLastRun({
        title: "营销投放日报生成",
        time: "今天 14:05 自动任务",
        summary: "已汇总昨日全渠道投放数据，生成日报草稿并推送到 Slack。",
      });

      setTodos([
        {
          id: "1",
          text: "审核客服渠道 API Key 是否过期",
          done: false,
          category: "review",
        },
        {
          id: "2",
          text: "更新 WhatsApp 渠道配置并保存",
          done: false,
          category: "config",
        },
        {
          id: "3",
          text: "确认昨日营销日报内容无误后发送",
          done: false,
          category: "approval",
        },
        {
          id: "4",
          text: "部署最新 Gateway 版本",
          done: true,
          category: "deploy",
        },
      ]);

      setTopTask({
        name: "生成营销日报",
        icon: "📝",
        desc: "汇总投放数据，生成日报并推送到营销频道",
        link: "/marketing",
      });

      setRecentSkills([
        {
          id: "1",
          name: "Data Analysis",
          icon: "📊",
          time: "2 min ago",
          category: "analysis",
        },
        {
          id: "2",
          name: "Email Campaign",
          icon: "📧",
          time: "15 min ago",
          category: "marketing",
        },
        {
          id: "3",
          name: "Image Generate",
          icon: "🎨",
          time: "1 hour ago",
          category: "creative",
        },
        {
          id: "4",
          name: "Document Write",
          icon: "📝",
          time: "3 hours ago",
          category: "writing",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

  const getCategoryIcon = (category: TodoItem["category"]): string => {
    switch (category) {
      case "approval":
        return "✅";
      case "config":
        return "⚙️";
      case "review":
        return "🔍";
      case "deploy":
        return "🚀";
      default:
        return "📌";
    }
  };

  const navigateToSkill = (skill: SkillUsage) => {
    const categoryToTab: Record<string, string> = {
      marketing: "/marketing",
      analysis: "/market-analysis",
      creative: "/brand-management",
      writing: "/marketing",
    };
    const tab = categoryToTab[skill.category];
    if (tab) window.location.href = tab;
  };

  const openTopTask = () => {
    if (topTask?.link) window.location.href = topTask.link;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container max-w-6xl mx-auto p-6 space-y-6">
      {/* 欢迎 */}
      <section className="welcome-section">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
            欢迎回来
          </div>
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleString()}
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">工作台概览</h1>
        <p className="text-muted-foreground">
          快速查看最新进展、待办与常用任务，底部可直接开启对话。
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 最近执行 */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="text-xs text-muted-foreground mb-2">最近执行</div>
          <div className="text-lg font-semibold">{lastRun?.title ?? "暂无任务"}</div>
          <div className="text-sm text-muted-foreground mb-2">
            {lastRun?.time ?? "--"}
          </div>
          <p className="text-sm">{lastRun?.summary ?? "还没有执行记录"}</p>
        </div>

        {/* 常用任务 */}
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="text-xs text-accent mb-2">常用任务</div>
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">{topTask?.icon ?? "✨"}</div>
            <div className="flex-1">
              <div className="text-lg font-semibold">{topTask?.name ?? "未配置"}</div>
              <p className="text-sm text-muted-foreground">
                {topTask?.desc ?? "设置一个常用任务以便快速进入。"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openTopTask}
            disabled={!topTask?.link}
            className="w-full px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            前往执行
          </button>
        </div>
      </section>

      {/* 待办事项 */}
      <section className="border border-border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">待办</h2>
          <span className="text-xs px-2 py-1 bg-muted rounded-full">
            {todos.filter((t) => !t.done).length} 未完成
          </span>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center gap-3 p-3 rounded-md transition-colors ${
                todo.done ? "bg-muted/30" : "hover:bg-muted/50"
              }`}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                aria-label={`Mark ${todo.text} as ${todo.done ? "incomplete" : "complete"}`}
                className="w-4 h-4"
              />
              <span className="text-lg">{getCategoryIcon(todo.category)}</span>
              <span className={`flex-1 ${todo.done ? "line-through text-muted-foreground" : ""}`}>
                {todo.text}
              </span>
              {todo.done && <span className="text-green-600">✓</span>}
            </li>
          ))}
        </ul>
      </section>

      {/* 最近使用的技能 / 任务 */}
      <section className="border border-border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">最近使用</h2>
          <a href="/skills" className="text-sm text-accent hover:underline">
            查看全部 →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentSkills.map((skill) => (
            <div
              key={skill.id}
              onClick={() => navigateToSkill(skill)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigateToSkill(skill);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Open ${skill.name}`}
              className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <div className="text-2xl">{skill.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{skill.name}</div>
                <div className="text-xs text-muted-foreground">{skill.time}</div>
              </div>
              <div className="text-muted-foreground">→</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
