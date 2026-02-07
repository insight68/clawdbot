"use client";

import { useEffect, useState } from "react";

export interface MessageStats {
  total: number;
  processed: number;
  successRate: number;
  avgProcessTime: number;
}

export interface ToolCallStats {
  toolName: string;
  callCount: number;
  category: string;
}

export default function StatisticsPage() {
  const [messageStats, setMessageStats] = useState<MessageStats>({
    total: 0,
    processed: 0,
    successRate: 0,
    avgProcessTime: 0,
  });
  const [toolCalls, setToolCalls] = useState<ToolCallStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d");

  useEffect(() => {
    void fetchStatisticsData();
  }, [timeRange]);

  const fetchStatisticsData = async () => {
    setLoading(true);

    try {
      // TODO: 从 Gateway API 获取真实统计数据
      // 目前使用模拟数据
      setMessageStats({
        total: 15234,
        processed: 14856,
        successRate: 97.5,
        avgProcessTime: 245,
      });

      setToolCalls([
        { toolName: "Data Analysis", callCount: 342, category: "analysis" },
        { toolName: "Email Campaign", callCount: 156, category: "marketing" },
        { toolName: "Image Generate", callCount: 89, category: "creative" },
        { toolName: "Document Write", callCount: 234, category: "writing" },
        { toolName: "Web Search", callCount: 567, category: "research" },
        { toolName: "Code Execute", callCount: 123, category: "development" },
        { toolName: "File Process", callCount: 98, category: "utility" },
        { toolName: "API Call", callCount: 445, category: "integration" },
      ]);
    } catch (error) {
      console.error("Failed to fetch statistics data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const getMaxCallCount = (): number => {
    return Math.max(...toolCalls.map((t) => t.callCount));
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      analysis: "rgb(59, 130, 246)",
      marketing: "rgb(168, 85, 247)",
      creative: "rgb(236, 72, 153)",
      writing: "rgb(34, 197, 94)",
      research: "rgb(234, 179, 8)",
      development: "rgb(239, 68, 68)",
      utility: "rgb(107, 114, 128)",
      integration: "rgb(20, 184, 166)",
    };
    return colors[category] || "rgb(107, 114, 128)";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading statistics...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-muted-foreground mt-1">消息统计和工具调用分析</p>
        </div>

        {/* 时间范围选择器 */}
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as const).map((range) => (
            <button
              key={range}
              type="button"
              className={`px-4 py-2 rounded-md transition-colors ${
                timeRange === range
                  ? "bg-accent text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
              onClick={() => setTimeRange(range)}
            >
              {range === "24h" ? "24小时" : range === "7d" ? "7天" : "30天"}
            </button>
          ))}
        </div>
      </div>

      {/* 消息统计卡片 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📨</span>
            <span className="text-sm text-muted-foreground">Total Messages</span>
          </div>
          <div className="text-2xl font-bold">{formatNumber(messageStats.total)}</div>
          <div className="text-xs text-green-600 mt-1">+12.5% vs last period</div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">✅</span>
            <span className="text-sm text-muted-foreground">Processed</span>
          </div>
          <div className="text-2xl font-bold">{formatNumber(messageStats.processed)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {((messageStats.processed / messageStats.total) * 100).toFixed(1)}% processed
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">📈</span>
            <span className="text-sm text-muted-foreground">Success Rate</span>
          </div>
          <div className="text-2xl font-bold">{messageStats.successRate}%</div>
          <div className="text-xs text-green-600 mt-1">+2.3% vs last period</div>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">⏱️</span>
            <span className="text-sm text-muted-foreground">Avg Process Time</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(messageStats.avgProcessTime)}</div>
          <div className="text-xs text-red-600 mt-1">+8% vs last period</div>
        </div>
      </section>

      {/* 工具调用统计 */}
      <section className="border border-border rounded-lg p-4 bg-card">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Tool Usage</h2>
          <p className="text-sm text-muted-foreground">Most frequently used tools</p>
        </div>

        <div className="space-y-3">
          {toolCalls.map((tool, index) => {
            const maxCount = getMaxCallCount();
            const percentage = (tool.callCount / maxCount) * 100;
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{tool.toolName}</div>
                  <div className="text-xs" style={{ color: getCategoryColor(tool.category) }}>
                    {tool.category}
                  </div>
                </div>
                <div className="text-right min-w-[120px]">
                  <div className="text-sm font-medium">{formatNumber(tool.callCount)} calls</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getCategoryColor(tool.category),
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
