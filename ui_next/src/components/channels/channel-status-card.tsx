"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";

interface ChannelStatusCardProps {
  title: string;
  icon?: string;
  status?: {
    configured: boolean;
    linked?: boolean;
    running: boolean;
    connected?: boolean;
    lastError?: string | null;
  } | null;
  isLoading?: boolean;
  onProbe?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onLogout?: () => void;
  children?: React.ReactNode;
  className?: string;
}

/**
 * 频道状态卡片组件
 */
export function ChannelStatusCard({
  title,
  icon,
  status,
  isLoading = false,
  onProbe,
  onStart,
  onStop,
  onLogout,
  children,
  className = "",
}: ChannelStatusCardProps) {
  const isConfigured = status?.configured ?? false;
  const isLinked = status?.linked ?? false;
  const isRunning = status?.running ?? false;
  const isConnected = status?.connected ?? false;
  const hasError = status?.lastError != null;

  return (
    <Card variant="outlined" className={`p-4 ${className}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>

        {/* 状态指示器 */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : status != null ? (
            <>
              <StatusBadge
                configured={isConfigured}
                linked={isLinked}
                running={isRunning}
                connected={isConnected}
                hasError={hasError}
              />
            </>
          ) : null}
        </div>
      </div>

      {/* 错误提示 */}
      {hasError && (
        <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-600 dark:text-red-400 text-sm">
          {status.lastError}
        </div>
      )}

      {/* 自定义内容 */}
      {children}

      {/* 操作按钮 */}
      <div className="flex items-center gap-2 mt-4">
        {onProbe && (
          <Button variant="secondary" size="sm" onClick={onProbe} disabled={isLoading}>
            Probe
          </Button>
        )}

        {onStart && isConfigured && !isRunning && (
          <Button variant="primary" size="sm" onClick={onStart} disabled={isLoading}>
            Start
          </Button>
        )}

        {onStop && isRunning && (
          <Button variant="danger" size="sm" onClick={onStop} disabled={isLoading}>
            Stop
          </Button>
        )}

        {onLogout && (isLinked || isConnected) && (
          <Button variant="ghost" size="sm" onClick={onLogout} disabled={isLoading}>
            Logout
          </Button>
        )}
      </div>
    </Card>
  );
}

/**
 * 状态徽章组件
 */
function StatusBadge({
  configured,
  linked,
  running,
  connected,
  hasError,
}: {
  configured: boolean;
  linked?: boolean;
  running: boolean;
  connected?: boolean;
  hasError: boolean;
}) {
  if (hasError) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
        Error
      </span>
    );
  }

  if (connected) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Connected
      </span>
    );
  }

  if (running) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
        Running
      </span>
    );
  }

  if (linked) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">
        Linked
      </span>
    );
  }

  if (configured) {
    return (
      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
        Configured
      </span>
    );
  }

  return (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500">
      Not Configured
    </span>
  );
}

/**
 * 频道信息行组件
 */
interface ChannelInfoRowProps {
  label: string;
  value: string | null | undefined;
  className?: string;
}

export function ChannelInfoRow({ label, value, className = "" }: ChannelInfoRowProps) {
  return (
    <div className={`flex justify-between items-center py-1 text-sm ${className}`}>
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value || "—"}</span>
    </div>
  );
}
