"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLogsAndCron } from "../../hooks/use-logs-cron";
import type { LogEntry, LogLevel } from "../../types/logs";

const LEVELS: LogLevel[] = ["trace", "debug", "info", "warn", "error", "fatal"];

function formatTime(value?: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString();
}

function matchesFilter(entry: LogEntry, needle: string): boolean {
  if (!needle) return true;
  const haystack = [entry.message, entry.subsystem, entry.raw]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

function getLevelColor(level: LogLevel): string {
  const colors: Record<LogLevel, string> = {
    trace: "text-gray-500 dark:text-gray-400",
    debug: "text-gray-600 dark:text-gray-300",
    info: "text-blue-600 dark:text-blue-400",
    warn: "text-yellow-600 dark:text-yellow-400",
    error: "text-red-600 dark:text-red-400",
    fatal: "text-purple-600 dark:text-purple-400",
  };
  return colors[level] || "";
}

interface LogsViewerProps {
  /**
   * 基础路径
   */
  basePath?: string;
}

/**
 * 日志查看器组件
 */
export function LogsViewer({ basePath = "" }: LogsViewerProps) {
  const {
    logs,
    logsSearchQuery,
    selectedLogLevel,
    filterSubsystems,
    maxLogs,
    autoScroll,
    logsLoading,
    logsError,
    loadLogs,
    setLogsSearchQuery,
    setSelectedLogLevel,
    toggleSubsystem,
    setMaxLogs,
    setAutoScroll,
  } = useLogsAndCron();

  const scrollRef = useRef<HTMLDivElement>(null);
  const levelFilters: Record<LogLevel, boolean> = useMemo(() => {
    return {
      trace: !selectedLogLevel || selectedLogLevel === "trace",
      debug: !selectedLogLevel || selectedLogLevel === "debug" || selectedLogLevel === "trace",
      info: !selectedLogLevel || ["info", "debug", "trace"].includes(selectedLogLevel),
      warn: !selectedLogLevel || ["warn", "info", "debug", "trace"].includes(selectedLogLevel),
      error: !selectedLogLevel || ["error", "warn", "info", "debug", "trace"].includes(selectedLogLevel),
      fatal: !selectedLogLevel || ["fatal", "error", "warn", "info", "debug", "trace"].includes(selectedLogLevel),
    };
  }, [selectedLogLevel]);

  const filtered = useMemo(() => {
    const needle = logsSearchQuery.trim().toLowerCase();
    return logs.filter((entry) => {
      if (entry.level && !levelFilters[entry.level]) return false;
      return matchesFilter(entry, needle);
    });
  }, [logs, logsSearchQuery, levelFilters]);

  // Auto-scroll when new logs arrive and autoScroll is enabled
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const handleRefresh = () => {
    loadLogs();
  };

  const handleExport = () => {
    const lines = filtered.map((entry) => entry.raw);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isNearBottom = target.scrollHeight - target.scrollTop - target.clientHeight < 100;
    setAutoScroll(isNearBottom);
  };

  return (
    <div className="logs-container">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Logs</h2>
          <p className="text-sm text-muted-foreground">Gateway file logs (JSONL).</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={logsLoading}
            onClick={handleRefresh}
            className="px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90 disabled:opacity-50"
          >
            {logsLoading ? "Loading..." : "Refresh"}
          </button>
          <button
            type="button"
            disabled={filtered.length === 0}
            onClick={handleExport}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 disabled:opacity-50"
          >
            Export visible
          </button>
        </div>
      </div>

      <div className="flex gap-4 mt-4 flex-wrap">
        <label className="field min-w-[220px]">
          <span className="text-sm">Filter</span>
          <input
            type="text"
            value={logsSearchQuery}
            onChange={(e) => setLogsSearchQuery(e.target.value)}
            placeholder="Search logs"
            className="w-full px-3 py-2 border border-border rounded-md bg-background"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={autoScroll}
            onChange={(e) => setAutoScroll(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Auto-follow</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-sm">Max logs:</span>
          <input
            type="number"
            value={maxLogs}
            onChange={(e) => setMaxLogs(Number(e.target.value))}
            className="w-20 px-2 py-1 border border-border rounded-md bg-background"
          />
        </label>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {LEVELS.map((level) => (
          <label
            key={level}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer ${
              levelFilters[level] ? "bg-muted" : "bg-muted/50 opacity-60"
            }`}
          >
            <input
              type="checkbox"
              checked={levelFilters[level]}
              onChange={(e) => toggleSubsystem(level)}
              className="w-3 h-3"
            />
            <span className={`text-xs uppercase ${getLevelColor(level)}`}>{level}</span>
          </label>
        ))}
      </div>

      {logsError && (
        <div className="p-4 mt-4 bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 rounded-md">
          {logsError}
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="mt-4 p-4 bg-background border border-border rounded-md overflow-auto max-h-[600px] font-mono text-sm"
      >
        {filtered.length === 0 ? (
          <div className="text-muted-foreground text-center py-8">No log entries.</div>
        ) : (
          <div className="space-y-1">
            {filtered.map((entry, idx) => (
              <div key={idx} className="flex gap-2 text-xs hover:bg-muted/30 px-2 py-1 rounded">
                <span className="text-muted-foreground flex-shrink-0 w-20">
                  {formatTime(entry.time)}
                </span>
                <span className={`font-semibold flex-shrink-0 w-12 ${getLevelColor(entry.level ?? "info")}`}>
                  {entry.level ?? ""}
                </span>
                <span className="text-muted-foreground flex-shrink-0 w-24 truncate">
                  {entry.subsystem ?? ""}
                </span>
                <span className="flex-1 break-all">{entry.message ?? entry.raw}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
